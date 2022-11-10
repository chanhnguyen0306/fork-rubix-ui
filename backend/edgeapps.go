package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/lib-systemctl-go/systemd"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/systemctl"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

// EdgeDeviceInfoAndApps list the installed apps
func (inst *App) EdgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion string) *EdgeDeviceInfo {
	edgeAppsAndService, err := inst.edgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return edgeAppsAndService
}

// EdgeUnInstallApp uninstall an app
func (inst *App) EdgeUnInstallApp(connUUID, hostUUID, appName string) *systemd.UninstallResponse {
	resp, err := inst.edgeUnInstallApp(connUUID, hostUUID, appName)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

type EdgeInstallAppBulk struct {
	AppName  string `json:"app_name"`
	Version  string `json:"version"`
	Arch     string `json:"arch"`
	HostUUID string `json:"host_uuid"`
}

type EdgeInstallAppsBulk struct {
	AppsList []EdgeInstallAppBulk `json:"apps_list"`
}

func (inst *App) EdgeInstallAppsBulk(connUUID, releaseVersion string, appsList EdgeInstallAppsBulk) {
	for _, app := range appsList.AppsList {
		inst.EdgeInstallApp(connUUID, app.HostUUID, app.AppName, app.Version, releaseVersion)
	}
}

// EdgeInstallApp install an app
// if app is FF then we need to upgrade all the plugins
// if app has plugins to upload the plugins and restart FF
func (inst *App) EdgeInstallApp(connUUID, hostUUID, appName, appVersion, releaseVersion string) *systemd.InstallResponse {
	var arch string
	getProduct := inst.EdgeProductInfo(connUUID, hostUUID) // TODO remove this as arch is meant to be provided by the UI
	if getProduct != nil {
		arch = getProduct.Arch
	} else {
		inst.uiErrorMessage(fmt.Sprintf("failed to find device app: %s arch: %s", appName, arch))
		return nil
	}
	log.Infof("start app install app: %s version: %s arch: %s", appName, appVersion, arch)
	releaseVersion = getProduct.FlowVersion // TODO UI needs to pass this in

	err := inst.writeAppConfig(connUUID, hostUUID, appName)
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

	var lastStep = "5"
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

	release, err := inst.getReleaseByVersion(releaseVersion)
	if release == nil {
		inst.uiErrorMessage(fmt.Sprintf("failed to find a vaild release version: %s", releaseVersion))
		return nil
	}
	var appHasPlugins bool
	var doNotValidateArch bool
	var moveExtractedFileToNameApp bool
	var moveOneLevelInsideFileToOutside bool
	for _, app := range release.Apps {
		if app.Name == appName {
			doNotValidateArch = app.DoNotValidateArch
			moveExtractedFileToNameApp = app.MoveExtractedFileToNameApp
			moveOneLevelInsideFileToOutside = app.MoveOneLevelInsideFileToOutside
			for _, plg := range app.PluginDependency {
				appHasPlugins = true
				inst.uiSuccessMessage(fmt.Sprintf("plugin will be installed (plugin: %s)", plg))
			}
		}
	}
	err = inst.appStore.StoreCheckAppAndVersionExists(appName, arch, appVersion) // check if app is in the appStore and if not then try and download it
	if err != nil {
		inst.uiSuccessMessage(fmt.Sprintf("app: %s not found in appStore so download", appName))
		token, err := inst.GetGitToken(constants.SettingUUID, false)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("failed to get git token %s", err.Error()))
			return nil
		}
		inst.StoreDownloadApp(token, appName, releaseVersion, arch, true)
	}
	product := getProduct.Product
	log.Println("Install App > add check to make its correct arch and product")
	if product == "" {
		inst.uiErrorMessage("product can't be empty")
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) got edge device details with product type: %s & app_name: %s", lastStep, product, appName))

	log.Println("Install App > upload app to assist and in check to see if app is already uploaded")
	assistUpload, err := inst.assistAddUploadApp(connUUID, appName, appVersion, arch, doNotValidateArch)
	if err != nil {
		log.Errorf("Install App > upload app to assist failed, app_name: %s, err: %s", appName, err.Error())
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) uploaded app to rubix-assist, app_name: %s", lastStep, assistUpload.Name))

	upload := installer.Upload{
		Name:                            appName,
		Version:                         appVersion,
		Product:                         product,
		Arch:                            arch,
		DoNotValidateArch:               doNotValidateArch,
		MoveExtractedFileToNameApp:      moveExtractedFileToNameApp,
		MoveOneLevelInsideFileToOutside: moveOneLevelInsideFileToOutside,
	}
	uploadApp, err := inst.edgeUploadEdgeApp(connUUID, hostUUID, upload)
	if err != nil {
		log.Errorf("Install App > upload app to edge failed, app_name: %s, err: %s", appName, err.Error())
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 3 of %s) uploaded app to rubix-edge, app_name: %s", lastStep, uploadApp.Name))

	uploadEdgeService, err := inst.uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion)
	if err != nil {
		log.Errorf("Install App > upload linux service to edge failed, app_name: %s", appName)
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 4 of %s) uploaded linux-service to rubix-edge, app_name: %s", lastStep, uploadEdgeService.UploadedFile))

	serviceFile := uploadEdgeService.UploadedFile
	installEdgeService, err := inst.installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFile)
	if err != nil {
		log.Errorf("Install App > install edge service failed, app_name: %s, err: %s", appName, err.Error())
		inst.uiErrorMessage(err.Error())
		return nil
	}

	if appHasPlugins { // install the plugins
		for _, app := range release.Apps {
			if app.Name == appName {
				for _, plg := range app.PluginDependency {
					appHasPlugins = true
					inst.EdgeUploadPlugin(connUUID, hostUUID, &appstore.Plugin{
						Name:    plg,
						Arch:    arch,
						Version: releaseVersion,
					}, false)
				}
			}
		}
		restart, err := inst.edgeRestartFlowFramework(connUUID, hostUUID)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("restart flow-framework, err: %s", err.Error()))
		} else {
			inst.uiSuccessMessage(fmt.Sprintf("restart flow-framework, msg: %s", restart.Message))
		}
	}

	if appName == constants.FlowFramework { // if app is FF then update all the plugins
		inst.uiSuccessMessage(fmt.Sprintf("update all plugins for flow-framework"))
		_, err := inst.EdgeUpgradePlugins(connUUID, hostUUID, releaseVersion)
		if err != nil {
			return nil
		}
		restart, err := inst.edgeRestartFlowFramework(connUUID, hostUUID)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("restart flow-framework, err: %s", err.Error()))
		} else {
			inst.uiSuccessMessage(fmt.Sprintf("restart flow-framework, msg: %s", restart.Message))
		}
	}

	inst.uiSuccessMessage(fmt.Sprintf("(step 5 of %s) installed successfully, app_name: %s", lastStep, appName))
	return installEdgeService
}

type EdgeDeviceInfo struct {
	Product                 *installer.Product        `json:"product,omitempty"`
	InstalledApps           []InstalledApps           `json:"installed_apps,omitempty"`
	AppsAvailableForInstall []AppsAvailableForInstall `json:"apps_available_for_install,omitempty"`
}

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

// edgeDeviceInfoAndApps get the complete app info of the device, installed apps, what apps can be installed and the product info
func (inst *App) edgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion string) (*EdgeDeviceInfo, error) {
	pro, err := inst.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	if releaseVersion == "" {
		releaseVersion = pro.FlowVersion
	}
	installed, err := inst.edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion, pro)
	if err != nil {
		return nil, err
	}
	return &EdgeDeviceInfo{
		Product:                 pro,
		InstalledApps:           installed.InstalledApps,
		AppsAvailableForInstall: installed.AppsAvailableForInstall,
	}, nil
}

// edgeAppsInstalledVersions list the installed apps on the edge device and what is available for install
func (inst *App) edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion string, product *installer.Product) (*EdgeDeviceInfo, error) {
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
func (inst *App) edgeListAppsStatus(connUUID, hostUUID string) ([]installer.AppsStatus, error) {
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

// edgeListAppsAndService list all the apps in the rubix-service dir that have a service
func (inst *App) edgeListAppsAndService(connUUID, hostUUID string) ([]installer.Apps, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListApps(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) edgeUploadEdgeApp(connUUID, hostUUID string, upload installer.Upload) (*installer.AppResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeUploadApp(hostUUID, &upload)
	return resp, err
}

func (inst *App) uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion string) (*appstore.UploadResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	nubeApp, err := inst.getAppFromReleases(releaseVersion, appName)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeUploadService(hostUUID, &systemctl.ServiceFile{
		Name:                        appName,
		Version:                     appVersion,
		ExecStart:                   nubeApp.ExecStart,
		AttachWorkingDirOnExecStart: nubeApp.AttachWorkingDirOnExecStart,
		EnvironmentVars:             nubeApp.EnvironmentVars,
	})
	return resp, err
}

func (inst *App) installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*systemd.InstallResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.InstallEdgeService(hostUUID, &installer.Install{
		Name:    appName,
		Version: appVersion,
		Source:  serviceFilePath,
	})
	return resp, err
}

func (inst *App) edgeAppInstall(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*systemd.InstallResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.InstallEdgeService(hostUUID, &installer.Install{
		Name:    appName,
		Version: appVersion,
		Source:  serviceFilePath,
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
