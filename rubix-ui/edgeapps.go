package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

// EdgeDeviceInfoAndApps list the installed apps
func (inst *App) EdgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion string) *EdgeDeviceInfo {
	edgeAppsAndService, err := inst.edgeDeviceInfoAndApps(connUUID, hostUUID, releaseVersion)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return edgeAppsAndService
}

// EdgeServices list the services on the edge device with name "nubeio"
func (inst *App) EdgeServices(connUUID, hostUUID string) []installer.InstalledServices {
	service, err := inst.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return service
}

// EdgeUnInstallApp uninstall an app
func (inst *App) EdgeUnInstallApp(connUUID, hostUUID, appName string) *installer.RemoveRes {
	resp, err := inst.edgeUnInstallApp(connUUID, hostUUID, appName)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

// EdgeInstallApp install an app
func (inst *App) EdgeInstallApp(connUUID, hostUUID, appName, appVersion, arch, releaseVersion string) *installer.InstallResp {
	var lastStep = "5"
	if err := emptyString(releaseVersion, "releaseVersion"); err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(appName, "appName"); err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(appVersion, "appVersion"); err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(arch, "arch"); err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}

	release, err := inst.getReleaseByVersion(releaseVersion)
	var appHasPlugins bool
	var releaseApp *store.Apps
	for _, app := range release.Apps {
		if app.Name == appName {
			releaseApp = &app
			for _, plg := range app.PluginDependency {
				appHasPlugins = true
				inst.crudMessage(true, fmt.Sprintf("app and plugin will be installed (app:%s plugin%s)", app.Name, plg))
			}
		}
	}

	if releaseApp != nil {

	}

	err = inst.StoreCheckAppExists(appName)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	err = inst.StoreCheckAppAndVersionExists(appName, appVersion)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	info, err := inst.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		log.Errorf("install-edge-app get product:%s", err.Error())
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var product = info.Product
	log.Errorln(" INSTALL-APP add check to make its correct arch and product")
	inst.crudMessage(true, fmt.Sprintf("(step 1 of %s) get edge device details product type:%s app:%s", lastStep, product, appName))
	if err = emptyString(product, "product"); err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	log.Errorln("INSTALL-APP UPLOAD APP TO ASSIST AND IN CHECK TO SEE IF APP IS ALREADY UPLOADED")
	assistUpload, err := inst.assistAddUploadApp(connUUID, appName, appVersion, product, arch)
	if err != nil {
		log.Errorf("install-edge-app upload app to rubix-assist app-name:%s err:%s", appName, err.Error())
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) upload app to rubix-assist app:%s", lastStep, assistUpload.Name))
	uploadApp, err := inst.edgeUploadEdgeApp(connUUID, hostUUID, appName, appVersion, product, arch)
	if err != nil {
		log.Errorf("install-edge-app upload app to edge app-name:%s err:%s", appName, err.Error())
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	inst.crudMessage(true, fmt.Sprintf("(step 3 of %s) upload app to rubix-edge app:%s", lastStep, uploadApp.Name))
	uploadEdgeService, err := inst.uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion)
	if err != nil {
		log.Errorf("install-edge-app upload linux-service to edge app-name:%s", appName)
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	inst.crudMessage(true, fmt.Sprintf("(step 4 of %s) upload linux-service to rubix-edge name:%s", lastStep, uploadEdgeService.UploadedFile))
	serviceFile := uploadEdgeService.UploadedFile
	installEdgeService, err := inst.installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFile)
	if err != nil {
		log.Errorf("install-edge-app install app to edge app-name:%s err:%s", appName, err.Error())
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}

	if appHasPlugins {
		for _, plg := range releaseApp.PluginDependency {
			appHasPlugins = true
			inst.crudMessage(true, fmt.Sprintf("start upload and install of plugin (app:%s plugin%s)", appName, plg))
			inst.EdgeUploadPlugin(connUUID, hostUUID, &appstore.Plugin{
				PluginName: plg,
				Arch:       arch,
				Version:    appVersion,
			}, false)
		}
		restart, err := inst.edgeRestartFlowFramework(connUUID, hostUUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("restart flow-framework err:%s", err.Error()))
		} else {
			inst.crudMessage(true, fmt.Sprintf("(step 4 of %s)  restart flow-framework msg:%s", lastStep, restart.Message))
		}
	}
	inst.crudMessage(true, fmt.Sprintf("(step 5 of %s) install app rubix-edge %s name:%s", lastStep, installEdgeService.Install, appName))
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
	if err != nil {
		return nil, err
	}
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
			if installedApp.AppName == flowFramework {

			}
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
					installedApp.Message = fmt.Sprintf("installed version and store version match version:%s", installedAppVersion)
					installedApp.Match = true
				} else {
					if installedAppVersion.LessThan(storeAppVersion) {
						installedApp.Message = fmt.Sprintf("an upgrade is required to match (installed:%s | store:%s)", installedAppVersion, storeAppVersion)
						installedApp.UpgradeRequired = true
					} else {
						installedApp.Message = fmt.Sprintf("an downgrade is required to match (installed:%s | store:%s)", installedAppVersion, storeAppVersion)
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
	apps, err := inst.edgeListApps(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	services, err := inst.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var filteredApps []InstalledApps
	var filteredApp InstalledApps
	for _, installedApp := range apps {
		for _, service := range services {
			filteredApp.IsInstalled = false
			if installedApp.Name == service.AppName {
				filteredApp.AppName = installedApp.Name
				filteredApp.Version = installedApp.Version
				filteredApp.ServiceName = service.ServiceName
				filteredApp.State = string(service.AppStatus.State)
				filteredApp.ActiveState = string(service.AppStatus.ActiveState)
				filteredApp.SubState = string(service.AppStatus.SubState)
				if filteredApp.State != "" {
					filteredApp.IsInstalled = true
				}
				filteredApps = append(filteredApps, filteredApp)
			}
		}
	}
	return filteredApps, nil

}

// edgeListApps apps that are in the app dir
func (inst *App) edgeListApps(connUUID, hostUUID string) ([]installer.Apps, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListApps(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

// edgeAppServices apps that have a systemctl service
func (inst *App) edgeAppServices(connUUID, hostUUID string) ([]InstalledApps, error) {
	services, err := inst.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var filteredApps []InstalledApps
	var apps InstalledApps
	for _, service := range services {
		apps.AppName = service.AppName
		apps.ServiceName = service.ServiceName
		apps.State = string(service.AppStatus.State)
		apps.ActiveState = string(service.AppStatus.ActiveState)
		apps.SubState = string(service.AppStatus.SubState)
		if apps.ServiceName != "" {
			filteredApps = append(filteredApps, apps)
		}
	}

	return filteredApps, nil
}

// edgeListAppsAndService list all the apps in the rubix-service dir that have a service
func (inst *App) edgeListAppsAndService(connUUID, hostUUID string) ([]installer.InstalledServices, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListAppsAndService(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

// edgeListNubeServices list all the linux services starting with name "nubeio"
func (inst *App) edgeListNubeServices(connUUID, hostUUID string) ([]installer.InstalledServices, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListNubeServices(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) edgeUploadEdgeApp(connUUID, hostUUID, appName, appVersion, product, arch string) (*installer.AppResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.AddUploadEdgeApp(hostUUID, &appstore.EdgeApp{
		Name:    appName,
		Version: appVersion,
		Product: product,
		Arch:    arch,
	})
	return resp, err
}

func (inst *App) uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion string) (*appstore.UploadResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	nubeApp, err := inst.getAppFromReleases(releaseVersion, appName)
	if err != nil {
		return nil, err
	}
	resp, err := client.UploadEdgeService(hostUUID, &appstore.ServiceFile{
		Name:                appName,
		Version:             appVersion,
		AppSpecficExecStart: nubeApp.AppSpecficExecStart,
		EnvironmentVars:     nubeApp.EnvironmentVars,
	})
	return resp, err
}

func (inst *App) installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*installer.InstallResp, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.InstallEdgeService(hostUUID, &installer.Install{
		Name:        appName,
		Version:     appVersion,
		ServiceName: "",
		Source:      serviceFilePath,
	})
	return resp, err
}

func (inst *App) edgeAppInstall(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*installer.InstallResp, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.InstallEdgeService(hostUUID, &installer.Install{
		Name:        appName,
		Version:     appVersion,
		ServiceName: "",
		Source:      serviceFilePath,
	})
	return resp, err
}

func (inst *App) edgeUnInstallApp(connUUID, hostUUID, appName string) (*installer.RemoveRes, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeUnInstallApp(hostUUID, appName, true)
}

func emptyString(item, name string) error {
	if item == "" {
		return errors.New(fmt.Sprintf("%s", name))
	}
	return nil
}
