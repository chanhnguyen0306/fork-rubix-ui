package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
)

func (app *App) edgeProductInfo(connUUID, hostUUID string) (*installer.Product, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeProductInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) edgeListApps(connUUID, hostUUID string) ([]installer.Apps, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	fmt.Println(hostUUID)
	resp, err := client.EdgeListApps(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
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
