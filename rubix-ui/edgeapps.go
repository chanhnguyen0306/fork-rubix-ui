package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

// EdgeAppsInstalled list the installed apps
func (app *App) EdgeAppsInstalled(connUUID, hostUUID, releaseVersion string) []InstalledApps {
	edgeAppsAndService, err := app.edgeAppsInstalled(connUUID, hostUUID, releaseVersion)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return edgeAppsAndService
}

// EdgeServices list the services on the edge device with name "nubeio"
func (app *App) EdgeServices(connUUID, hostUUID string) []installer.InstalledServices {
	service, err := app.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return service
}

// EdgeUnInstallApp uninstall an app
func (app *App) EdgeUnInstallApp(connUUID, hostUUID, appName string) *installer.RemoveRes {
	resp, err := app.edgeUnInstallApp(connUUID, hostUUID, appName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

// EdgeInstallApp install an app
func (app *App) EdgeInstallApp(connUUID, hostUUID, appName, appVersion, arch, releaseVersion string) *installer.InstallResp {
	var lastStep = "5"
	if err := emptyString(releaseVersion, "releaseVersion"); err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(appName, "appName"); err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(appVersion, "appVersion"); err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if err := emptyString(arch, "arch"); err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	err := app.StoreCheckAppExists(appName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	err = app.StoreCheckAppAndVersionExists(appName, appVersion)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	info, err := app.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		log.Errorf("install-edge-app get product:%s", err.Error())
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var product = info.Product
	app.crudMessage(true, fmt.Sprintf("(step 1 of %s) get edge device details product type:%s app:%s", lastStep, product, appName))
	if err = emptyString(product, "product"); err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	assistUpload, err := app.assistAddUploadApp(connUUID, appName, appVersion, product, arch, false)
	if err != nil {
		log.Errorf("install-edge-app upload app to rubix-assist app-name:%s err:%s", appName, err.Error())
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	app.crudMessage(true, fmt.Sprintf("(step 2 of %s) upload app to rubix-assist app:%s", lastStep, assistUpload.Name))
	uploadApp, err := app.edgeUploadEdgeApp(connUUID, hostUUID, appName, appVersion, product, arch)
	if err != nil {
		log.Errorf("install-edge-app upload app to edge app-name:%s err:%s", appName, err.Error())
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	app.crudMessage(true, fmt.Sprintf("(step 3 of %s) upload app to rubix-edge app:%s", lastStep, uploadApp.Name))
	uploadEdgeService, err := app.uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion)
	if err != nil {
		log.Errorf("install-edge-app upload linux-service to edge app-name:%s err:%s", appName, err.Error())
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	app.crudMessage(true, fmt.Sprintf("(step 4 of %s) upload linux-service to rubix-edge name:%s", lastStep, uploadEdgeService.UploadedFile))
	serviceFile := uploadEdgeService.UploadedFile
	installEdgeService, err := app.installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFile)
	if err != nil {
		log.Errorf("install-edge-app install app to edge app-name:%s err:%s", appName, err.Error())
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	app.crudMessage(true, fmt.Sprintf("(step 5 of %s) install app rubix-edge name:%s", lastStep, installEdgeService.Install))
	return installEdgeService
}

type InstalledApps struct {
	AppName             string `json:"app_name,omitempty"`
	ServiceName         string `json:"service_name,omitempty"`
	InstalledAppVersion string `json:"app_version,omitempty"`
	LatestVersion       string `json:"latest_version,omitempty"`
	IsInstalled         bool   `json:"is_installed,omitempty"`
	Message             string `json:"message,omitempty"`
	Match               bool   `json:"match,omitempty"`
	DowngradeRequired   bool   `json:"downgrade_required,omitempty"`
	UpgradeRequired     bool   `json:"upgrade_required,omitempty"`
	ReleaseVersion      string `json:"release_version,omitempty"`
	EdgeReleaseVersion  string `json:"edge_release_version,omitempty"`
	State               string `json:"state,omitempty"`
	ActiveState         string `json:"active_state,omitempty"`
	SubState            string `json:"sub_state,omitempty"`
}

func (app *App) edgeAppsInstalled(connUUID, hostUUID, releaseVersion string) ([]InstalledApps, error) {
	services, err := app.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	installedApps, err := app.edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion)
	if err != nil {
		return nil, err
	}
	var filteredApps []InstalledApps
	for _, service := range services {
		for _, apps := range installedApps {
			if service.AppName == apps.AppName {
				apps.ServiceName = service.ServiceName
				apps.State = string(service.AppStatus.State)
				apps.ActiveState = string(service.AppStatus.ActiveState)
				apps.SubState = string(service.AppStatus.SubState)
				filteredApps = append(filteredApps, apps)

			}
		}
	}
	return filteredApps, nil
}

func (app *App) edgeAppsInstalledVersions(connUUID, hostUUID, releaseVersion string) ([]InstalledApps, error) {
	apps, err := app.edgeListApps(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	getVersion, err := app.getReleaseByVersion(releaseVersion)
	if err != nil {
		return nil, err
	}
	var installedApps []InstalledApps
	var installedApp InstalledApps
	installedApp.ReleaseVersion = releaseVersion
	for _, installed := range apps {
		for _, versionApp := range getVersion.Apps {
			if installed.Name == flowFramework {
				installedApp.EdgeReleaseVersion = installed.Version
			}
			if installed.Name == versionApp.Name {
				installedAppVersion, err := version.NewVersion(installed.Version)
				if err != nil {
					return nil, err
				}
				storeAppVersion, err := version.NewVersion(versionApp.Version)
				if err != nil {
					return nil, err
				}
				installedApp.IsInstalled = true
				installedApp.AppName = installed.Name
				installedApp.InstalledAppVersion = installed.Version
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
				installedApps = append(installedApps, installedApp)
			}
		}
	}
	return installedApps, nil
}

func (app *App) edgeListApps(connUUID, hostUUID string) ([]installer.Apps, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListApps(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) edgeAppServices(connUUID, hostUUID string) ([]InstalledApps, error) {
	services, err := app.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var filteredApps []InstalledApps
	var apps InstalledApps
	for _, service := range services {
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

func (app *App) edgeListAppsAndService(connUUID, hostUUID string) ([]installer.InstalledServices, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListAppsAndService(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) edgeListNubeServices(connUUID, hostUUID string) ([]installer.InstalledServices, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeListNubeServices(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) edgeUploadEdgeApp(connUUID, hostUUID, appName, appVersion, product, arch string) (*installer.AppResponse, error) {
	client, err := app.initConnection(connUUID)
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

func (app *App) uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion string) (*appstore.UploadResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	nubeApp, err := app.getAppFromReleases(releaseVersion, appName)
	if err != nil {
		return nil, err
	}
	resp, err := client.UploadEdgeService(hostUUID, &appstore.ServiceFile{
		Name:                    appName,
		Version:                 appVersion,
		ServiceDescription:      "",
		RunAsUser:               "",
		ServiceWorkingDirectory: "",
		AppSpecficExecStart:     nubeApp.AppSpecficExecStart,
	})
	return resp, err
}

func (app *App) installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*installer.InstallResp, error) {
	client, err := app.initConnection(connUUID)
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

func (app *App) edgeAppInstalled(connUUID, hostUUID, appName, appVersion, serviceFilePath string) (*installer.InstallResp, error) {
	client, err := app.initConnection(connUUID)
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

func (app *App) edgeUnInstallApp(connUUID, hostUUID, appName string) (*installer.RemoveRes, error) {
	client, err := app.initConnection(connUUID)
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
