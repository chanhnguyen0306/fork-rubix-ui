package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	log "github.com/sirupsen/logrus"
)

func emptyString(item, name string) error {
	if item == "" {
		return errors.New(fmt.Sprintf("%s", name))
	}
	return nil
}

/*

Get product info from the edge
List apps that are installed on the edge device to the user
From the product info list the available apps (for now list all apps)
On select of an app/apps to install follow these steps
- check if app is already installed on edge device
- check if app is in user apps store
- check if app is already uploaded to RA
- if all is good upload app to assist, then assist to install the app
*/

// GetReleases() let the user select a release of apps that they want to install (assume user has no internet, so we get the release from the DB)

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
