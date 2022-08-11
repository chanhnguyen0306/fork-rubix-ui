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

type EdgeAppInstall struct {
	ReleaseVersion string
	AppName        string
	AppVersion     string
	Arch           string
}

func (app *App) appInstallAppOnEdge(connUUID, hostUUID string, appInstall *EdgeAppInstall) *installer.InstallResp {
	var releaseVersion = appInstall.ReleaseVersion
	if err := emptyString(releaseVersion, "releaseVersion"); err != nil {
		return nil
	}
	var appName = appInstall.AppName
	if err := emptyString(appName, "appName"); err != nil {
		return nil
	}
	var appVersion = appInstall.AppVersion
	if err := emptyString(appVersion, "appVersion"); err != nil {
		return nil
	}
	var arch = appInstall.Arch
	if err := emptyString(arch, "arch"); err != nil {
		return nil
	}
	info, err := app.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		log.Errorf("install-edge-app get product:%s", err.Error())
		return nil
	}
	var product = info.Product
	if err = emptyString(product, "product"); err != nil {
		return nil
	}
	_, err = app.assistAddUploadApp(connUUID, appName, appVersion, product, arch, false)
	if err != nil {
		log.Errorf("install-edge-app upload app to rubix-assist app-name:%s err:%s", appName, err.Error())
		return nil
	}
	uploadApp, err := app.edgeUploadEdgeApp(connUUID, hostUUID, appName, appVersion, product, arch)
	if err != nil {
		log.Errorf("install-edge-app upload app to edge app-name:%s err:%s", appName, err.Error())
		return nil
	} else {
		log.Infof("uploaded app%s", uploadApp.Name)
	}
	uploadEdgeService, err := app.uploadEdgeService(connUUID, hostUUID, appName, appVersion, releaseVersion)
	if err != nil {
		log.Errorf("install-edge-app upload linux-service to edge app-name:%s err:%s", appName, err.Error())
		return nil
	}
	serviceFile := uploadEdgeService.UploadedFile
	installEdgeService, err := app.installEdgeService(connUUID, hostUUID, appName, appVersion, serviceFile)
	if err != nil {
		log.Errorf("install-edge-app install app to edge app-name:%s err:%s", appName, err.Error())
		return nil
	}
	return installEdgeService
}
