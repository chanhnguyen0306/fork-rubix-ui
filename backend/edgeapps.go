package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-systemctl-go/systemd"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/systemctl"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/store"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

type InstalledApps struct {
	AppName             string `json:"app_name,omitempty"`
	Version             string `json:"version,omitempty"`
	LatestVersion       string `json:"latest_version,omitempty"`
	ServiceName         string `json:"service_name,omitempty"`
	InstalledAppVersion string `json:"app_version,omitempty"`
	IsInstalled         bool   `json:"is_installed"`
	Message             string `json:"message,omitempty"`
	Match               bool   `json:"match,omitempty"`
	DowngradeRequired   bool   `json:"downgrade_required,omitempty"`
	UpgradeRequired     bool   `json:"upgrade_required,omitempty"`
	State               string `json:"state,omitempty"`
	ActiveState         string `json:"active_state,omitempty"`
	SubState            string `json:"sub_state,omitempty"`
}

type AppsAvailableForInstall struct {
	AppName       string `json:"app_name,omitempty"`
	LatestVersion string `json:"latest_version,omitempty"`
}

type EdgeDeviceInfo struct {
	Product                 *amodel.Product           `json:"product,omitempty"`
	InstalledApps           []InstalledApps           `json:"installed_apps,omitempty"`
	AppsAvailableForInstall []AppsAvailableForInstall `json:"apps_available_for_install,omitempty"`
}

// EdgeInstallApp install an app
// if app is FF then we need to upgrade all the plugins
// if app has plugins to upload the plugins and restart FF
func (inst *App) EdgeInstallApp(connUUID, hostUUID, appName, appVersion, releaseVersion string) *amodel.Message {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.uiErrorMessage(err)
		return nil
	}

	var arch string
	productInfo, err := assistClient.EdgeProductInfo(hostUUID)
	if err != nil {
		inst.uiErrorMessage(err)
		return nil
	}
	arch = productInfo.Arch

	log.Infof("start app install app: %s version: %s arch: %s", appName, appVersion, arch)
	releaseVersion = productInfo.FlowVersion

	_, err = assistClient.EdgeWriteConfig(hostUUID, appName)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("write app config: %s", err.Error()))
	}

	if releaseVersion == "" {
		release, err := inst.getLatestRelease()
		if release == "" || err != nil {
			inst.uiErrorMessage(fmt.Sprintf("failed to find a vaild release version"))
			return nil
		}
		releaseVersion = release
	}

	if releaseVersion == "" {
		inst.uiErrorMessage("release_version can't be empty")
		return nil
	}
	if appName == "" {
		inst.uiErrorMessage("app_name can't be empty")
		return nil
	}
	if appVersion == "" {
		inst.uiErrorMessage("app_version can't be empty")
		return nil
	}
	if arch == "" {
		inst.uiErrorMessage("arch can't be empty")
		return nil
	}

	var lastStep = "4"
	release, err := inst.getReleaseByVersion(releaseVersion)
	if release == nil {
		inst.uiErrorMessage(fmt.Sprintf("failed to find a vaild release version: %s", releaseVersion))
		return nil
	}
	var appHasPlugins bool
	var selectedApp store.Apps
	for _, app := range release.Apps {
		if app.Name == appName {
			selectedApp = app
			for _, plg := range app.PluginDependency {
				appHasPlugins = true
				inst.uiSuccessMessage(fmt.Sprintf("plugin will be installed (plugin: %s)", plg))
			}
		}
	}
	err = inst.appStore.StoreCheckAppAndVersionExists(appName, arch, appVersion)
	if err != nil {
		inst.uiSuccessMessage(fmt.Sprintf("%s app not found in app store so downloading it", appName))
		token, err := inst.GetGitToken(constants.SettingUUID, false)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("failed to get git token %s", err.Error()))
			return nil
		}
		inst.StoreDownloadApp(token, appName, releaseVersion, arch, true)
	}
	product := productInfo.Product
	log.Println("Install App > add check to make its correct arch and product")
	if product == "" {
		inst.uiErrorMessage("product can't be empty")
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) got edge device details with product type: %s & app_name: %s", lastStep, product, appName))

	log.Println("Install App > upload app to assist and in check to see if app is already uploaded")
	_, skip, err := inst.assistAddUploadApp(assistClient, appName, appVersion, arch, selectedApp.DoNotValidateArch)
	if err != nil {
		log.Errorf("Install App > upload app to assist failed, app_name: %s, err: %s", appName, err.Error())
		inst.uiErrorMessage(err.Error())
		return nil
	}
	if skip {
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) %s already exists on rubix-assist server", lastStep, appName))
	} else {
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) %s is uploaded app to rubix-assist server", lastStep, appName))
	}

	appUpload := amodel.AppUpload{
		Name:                            appName,
		Version:                         appVersion,
		Arch:                            arch,
		MoveExtractedFileToNameApp:      selectedApp.MoveExtractedFileToNameApp,
		MoveOneLevelInsideFileToOutside: selectedApp.MoveOneLevelInsideFileToOutside,
	}
	_, err = assistClient.EdgeAppUpload(hostUUID, &appUpload)
	if err != nil {
		log.Errorf("Install App > %s app upload to the edge got failed", appName)
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 3 of %s) %s app is uploaded to edge", lastStep, appName))

	if appHasPlugins {
		for _, app := range release.Apps {
			if app.Name == appName {
				for _, plg := range app.PluginDependency {
					inst.EdgeUploadPlugin(assistClient, hostUUID, &amodel.Plugin{
						Name:                 plg,
						Arch:                 arch,
						Version:              releaseVersion,
						ClearBeforeUploading: false,
					})
				}
			}
		}
	}
	if appName == constants.FlowFramework { // if app is FF then update all the plugins
		inst.uiSuccessMessage(fmt.Sprintf("need to update all plugins for flow-framework"))
		err := inst.edgeUploadPlugins(assistClient, hostUUID, releaseVersion)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return nil
		}
	}

	appInstall := systemctl.ServiceFile{
		Name:                        appName,
		Version:                     appVersion,
		ExecStart:                   selectedApp.ExecStart,
		AttachWorkingDirOnExecStart: selectedApp.AttachWorkingDirOnExecStart,
		EnvironmentVars:             selectedApp.EnvironmentVars,
	}
	_, err = assistClient.EdgeAppInstall(hostUUID, &appInstall)
	if err != nil {
		log.Errorf("Install App > %s app install on the edge got failed", appName)
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 4 of %s) %s app installed on the edge", lastStep, appName))

	if appHasPlugins {
		flowFrameworkApp := namings.GetServiceNameFromAppName(constants.FlowFramework)
		_, err := assistClient.EdgeSystemCtlAction(hostUUID, flowFrameworkApp, amodel.Restart)
		if err != nil {
			inst.uiErrorMessage("failed to restart flow-framework")
			return nil
		}
	}
	return &amodel.Message{Message: "successfully installed"}
}

// EdgeUnInstallApp uninstall an app
func (inst *App) EdgeUnInstallApp(connUUID, hostUUID, appName string) *amodel.Message {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.uiErrorMessage(err)
		return nil
	}
	resp, err := assistClient.EdgeAppUninstall(hostUUID, appName)
	if err != nil {
		inst.uiErrorMessage(err.Error())
		return nil
	}
	return resp
}

// EdgeDeviceInfoAndApps list the installed apps
func (inst *App) EdgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion string) *EdgeDeviceInfo {
	edgeAppsAndService, err := inst.edgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return edgeAppsAndService
}

// edgeDeviceInfoAndApps get the complete app info of the device, installed apps, what apps can be installed and the product info
func (inst *App) edgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion string) (*EdgeDeviceInfo, error) {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	product, err := assistClient.EdgeProductInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	if releaseVersion == "" {
		releaseVersion = product.FlowVersion
	}
	installed, err := inst.edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion, product)
	if err != nil {
		return nil, err
	}
	return &EdgeDeviceInfo{
		Product:                 product,
		InstalledApps:           installed.InstalledApps,
		AppsAvailableForInstall: installed.AppsAvailableForInstall,
	}, nil
}

// edgeAppsInstalledVersions list the installed apps on the edge device and what is available for install
func (inst *App) edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion string, product *amodel.Product) (*EdgeDeviceInfo, error) {
	installedApps, err := inst.edgeInstalledApps(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	getVersion, err := inst.getReleaseByVersion(releaseVersion)
	if getVersion == nil {
		versionNumber, _ := inst.getLatestRelease()
		getVersion, err = inst.getReleaseByVersion(versionNumber)
	}
	if getVersion == nil {
		token, err := inst.GetGitToken(constants.SettingUUID, false) // if not exist then try and download the version
		if err != nil {
			return nil, err
		}
		getVersion, err = inst.gitDownloadRelease(token, releaseVersion)
		if err != nil {
			return nil, err
		}
	}
	if getVersion == nil {
		return nil, errors.New(fmt.Sprintf("failed to find a valid release: %s", releaseVersion))
	}
	err = nil
	var appsList []InstalledApps
	var appsAvailable []AppsAvailableForInstall
	var appAvailable AppsAvailableForInstall
	for _, versionApp := range getVersion.Apps { // list all the that the edge device can install
		for _, pro := range versionApp.Products {
			if product.Product == pro {
				appAvailable.AppName = versionApp.Name
				appAvailable.LatestVersion = versionApp.Version
				appsAvailable = append(appsAvailable, appAvailable)
			}
		}
	}
	for _, installedApp := range installedApps {
		for _, versionApp := range getVersion.Apps {
			if installedApp.AppName == versionApp.Name {
				installedAppVersion, err := version.NewVersion(installedApp.Version)
				if err != nil {
					return nil, err
				}
				storeAppVersion, err := version.NewVersion(versionApp.Version)
				if err != nil {
					return nil, err
				}
				installedApp.IsInstalled = true
				installedApp.LatestVersion = versionApp.Version
				if installedAppVersion.String() == storeAppVersion.String() {
					installedApp.Message = fmt.Sprintf("installed version and appStore version match version: %s", installedAppVersion)
					installedApp.Match = true
				} else {
					if installedAppVersion.LessThan(storeAppVersion) {
						installedApp.Message = fmt.Sprintf("an upgrade is required to match (installed: %s | appStore: %s)", installedAppVersion, storeAppVersion)
						installedApp.UpgradeRequired = true
					} else {
						installedApp.Message = fmt.Sprintf("an downgrade is required to match (installed: %s | appStore: %s)", installedAppVersion, storeAppVersion)
						installedApp.DowngradeRequired = true
					}
				}
				appsList = append(appsList, installedApp)
			}
		}
	}

	return &EdgeDeviceInfo{
		Product:                 nil,
		InstalledApps:           appsList,
		AppsAvailableForInstall: appsAvailable,
	}, nil
}

// edgeListApps apps that are in the app dir and have a linux service
func (inst *App) edgeInstalledApps(connUUID, hostUUID string) ([]InstalledApps, error) {
	apps, err := inst.edgeListAppsStatus(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var filteredApps []InstalledApps
	var filteredApp InstalledApps
	for _, installedApp := range apps {
		filteredApp.IsInstalled = false
		filteredApp.AppName = installedApp.Name
		filteredApp.Version = installedApp.Version
		filteredApp.ServiceName = installedApp.ServiceName
		filteredApp.State = string(installedApp.State.State)
		filteredApp.ActiveState = string(installedApp.State.ActiveState)
		filteredApp.SubState = string(installedApp.State.SubState)
		if filteredApp.State != "" {
			filteredApp.IsInstalled = true
		}
		filteredApps = append(filteredApps, filteredApp)
	}
	return filteredApps, nil
}

// edgeListApps apps that are in the app dir
func (inst *App) edgeListAppsStatus(connUUID, hostUUID string) ([]amodel.AppsStatus, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListAppsStatus(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) uploadEdgeService(assistClient *assistcli.Client, hostUUID, appName, appVersion, releaseVersion string) (*appstore.UploadResponse, error) {
	nubeApp, err := inst.getAppFromReleases(releaseVersion, appName)
	if err != nil {
		return nil, err
	}
	resp, err := assistClient.EdgeUploadService(hostUUID, &systemctl.ServiceFile{
		Name:                        appName,
		Version:                     appVersion,
		ExecStart:                   nubeApp.ExecStart,
		AttachWorkingDirOnExecStart: nubeApp.AttachWorkingDirOnExecStart,
		EnvironmentVars:             nubeApp.EnvironmentVars,
	})
	return resp, err
}

func (inst *App) edgeUnInstallApp(connUUID, hostUUID, appName string) (*systemd.UninstallResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.EdgeUninstallApp(hostUUID, appName, false)
}
