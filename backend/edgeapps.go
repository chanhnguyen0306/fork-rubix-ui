package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/NubeIO/rubix-assist/service/systemctl"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/rumodel"
	"github.com/NubeIO/rubix-ui/backend/store"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

// EdgeInstallApp install an app
// if app is FF then we need to upgrade all the plugins
// if app has plugins to upload the plugins and restart FF
func (inst *App) EdgeInstallApp(connUUID, hostUUID, appName, appVersion string) *amodel.Message {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.uiErrorMessage(err)
		return nil
	}

	var arch string
	resp, err := assistClient.EdgeBiosArch(hostUUID)
	if err != nil {
		inst.uiErrorMessage(err)
		inst.uiErrorMessage("turn on BIOS on your edge device")
		return nil
	}
	arch = resp.Arch

	log.Infof("start app app install: %s version: %s arch: %s", appName, appVersion, arch)
	_, err = assistClient.EdgeWriteConfig(hostUUID, appName)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("write app config: %s", err.Error()))
	}

	var releaseVersion string
	if appName == constants.FlowFramework {
		releaseVersion = appVersion // FlowNetwork installation should select same release version
	} else {
		releaseVersion, err = inst.getReleaseVersion(assistClient, hostUUID)
		if err != nil {
			inst.uiErrorMessage(err)
			return nil
		}
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
	release, err := inst.DB.GetReleaseByVersion(releaseVersion)
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
		inst.StoreDownloadApp(token, releaseVersion, appName, appVersion, arch, true)
	}
	log.Println("app install > add check to make its correct arch and product")
	inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) got edge device details with app_name %s & release_version %s", lastStep, appName, releaseVersion))

	log.Println("app install > upload app to assist and in check to see if app is already uploaded")
	_, skip, err := inst.assistAddUploadApp(assistClient, appName, appVersion, arch, selectedApp.DoNotValidateArch)
	if err != nil {
		log.Errorf("app install > upload app to assist failed for app_name %s & err is: %s", appName, err.Error())
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
		log.Errorf("app install > %s app upload to the edge got failed", appName)
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
		log.Errorf("app install > %s app install on the edge got failed", appName)
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
func (inst *App) EdgeDeviceInfoAndApps(connUUID, hostUUID string) *rumodel.EdgeDeviceInfo {
	edgeAppsAndService, err := inst.edgeDeviceInfoAndApps(connUUID, hostUUID)
	if err != nil {
		inst.uiErrorMessage(err.Error())
		return nil
	}
	return edgeAppsAndService
}

// edgeDeviceInfoAndApps get the complete app info of the device, installed apps, what apps can be installed and the product info
func (inst *App) edgeDeviceInfoAndApps(connUUID, hostUUID string) (*rumodel.EdgeDeviceInfo, error) {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	releaseVersion, err := inst.getReleaseVersion(assistClient, hostUUID)
	if err != nil {
		return nil, err
	}
	release, err := inst.DB.GetRelease(releaseVersion)
	if release == nil {
		// if not exist then try and download the version
		token, err := inst.GetGitToken(constants.SettingUUID, false)
		if err != nil {
			return nil, err
		}
		release, err = inst.gitDownloadRelease(token, releaseVersion)
		if err != nil {
			return nil, err
		}
	}
	if release == nil {
		return nil, errors.New(fmt.Sprintf("failed to find a valid release: %s", releaseVersion))
	}

	deviceInfo, err := assistClient.EdgeDeviceInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	installedApps, err := inst.edgeInstalledApps(assistClient, hostUUID)
	if err != nil {
		return nil, err
	}
	var appsList []rumodel.InstalledApps
	var appsAvailable []rumodel.AppsAvailableForInstall
	for _, versionApp := range release.Apps { // list all the that the edge device can install
		for _, pro := range versionApp.Products {
			if deviceInfo.DeviceType == pro {
				var appAvailable rumodel.AppsAvailableForInstall
				appAvailable.AppName = versionApp.Name
				appAvailable.MinVersion = versionApp.MinVersion
				appAvailable.MaxVersion = versionApp.MaxVersion
				appsAvailable = append(appsAvailable, appAvailable)
			}
		}
	}
	for _, installedApp := range installedApps {
		for _, app := range release.Apps {
			if installedApp.AppName == app.Name {
				installedAppVersion, err := version.NewVersion(installedApp.Version)
				if err != nil {
					return nil, err
				}
				minVersion := app.MinVersion
				maxVersion := app.MaxVersion
				if app.MinVersion == "" {
					minVersion = "v0.0.0"
				}
				if app.MaxVersion == "" {
					maxVersion = "v1000.0.0"
				}
				minAppVersion, err := version.NewVersion(minVersion)
				if err != nil {
					return nil, err
				}
				maxAppVersion, err := version.NewVersion(maxVersion)
				if err != nil {
					return nil, err
				}
				installedApp.IsInstalled = true
				installedApp.MinVersion = app.MinVersion
				installedApp.MaxVersion = app.MaxVersion
				if installedAppVersion.GreaterThanOrEqual(minAppVersion) && installedAppVersion.LessThanOrEqual(maxAppVersion) {
					installedApp.Match = true
				} else {
					if installedAppVersion.LessThan(minAppVersion) {
						installedApp.UpgradeRequired = true
					} else {
						installedApp.DowngradeRequired = true
					}
				}
				appsList = append(appsList, installedApp)
			}
		}
	}

	return &rumodel.EdgeDeviceInfo{
		InstalledApps:           appsList,
		AppsAvailableForInstall: appsAvailable,
	}, nil
}

func (inst *App) edgeInstalledApps(assistClient *assistcli.Client, hostUUID string) ([]rumodel.InstalledApps, error) {
	apps, err := assistClient.EdgeListAppsStatus(hostUUID)
	if err != nil {
		return nil, err
	}
	var filteredApps []rumodel.InstalledApps
	var filteredApp rumodel.InstalledApps
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

func (inst *App) getReleaseVersion(assistClient *assistcli.Client, hostUUID string) (string, error) {
	var releaseVersion string
	appStatus, connectionErr, requestErr := assistClient.EdgeAppStatus(hostUUID, constants.FlowFramework)
	if connectionErr != nil {
		inst.uiErrorMessage(connectionErr)
		return "", connectionErr
	}
	if requestErr != nil {
		inst.uiWarningMessage(requestErr)
	}
	if appStatus != nil {
		releaseVersion = appStatus.Version
	} else {
		release, err := inst.getLatestReleaseVersion()
		if err != nil {
			return "", err
		}
		releaseVersion = release
	}
	return releaseVersion, nil
}
