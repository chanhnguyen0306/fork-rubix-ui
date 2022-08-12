package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
)

func (app *App) AppInstallAppOnEdge(connUUID, hostUUID, appName, appVersion, arch, releaseVersion string) *installer.InstallResp {
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

func (app *App) EdgeListAppsAndService(connUUID, hostUUID string) []installer.InstalledServices {
	service, err := app.edgeListAppsAndService(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return service
}

type InstalledApps struct {
	AppName             string `json:"app_name,omitempty"`
	InstalledAppVersion string `json:"app_version,omitempty"`
	LatestVersion       string `json:"latest_version,omitempty"`
	IsInstalled         bool   `json:"is_installed"`
	Message             string `json:"message"`
	Match               bool   `json:"match,omitempty"`
	DowngradeRequired   bool   `json:"downgrade_required,omitempty"`
	UpgradeRequired     bool   `json:"upgrade_required,omitempty"`
	ReleaseVersion      string `json:"release_version"`
	EdgeReleaseVersion  string `json:"edge_release_version"`
}

func (app *App) EdgeAppsInstalledComparedToReleaseVersion(connUUID, hostUUID, releaseVersion string) []InstalledApps {
	apps, err := app.edgeListApps(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	getVersion, err := app.getReleaseByVersion(releaseVersion)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
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
					return nil
				}
				storeAppVersion, err := version.NewVersion(versionApp.Version)
				if err != nil {
					return nil
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
	return installedApps
}

func emptyString(item, name string) error {
	if item == "" {
		return errors.New(fmt.Sprintf("%s", name))
	}
	return nil
}
