package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
)

func (app *App) assistListStore(connUUID string) ([]appstore.ListApps, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.ListAppsWithVersions()
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) assistAddUploadApp(connUUID, appName, version, product, arch string, addIfExisting bool) (*appstore.UploadResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    arch,
	}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, err
	}
	err = appStore.StoreCheckAppExists(appName)
	if err != nil {
		return nil, err
	}
	err = appStore.StoreCheckAppAndVersionExists(appName, version)
	if err != nil {
		return nil, err
	}
	path := inst.GetAppPathAndVersion(appName, version)
	var dontCheckArch bool
	if appName == rubixWires {
		dontCheckArch = true
	}
	buildDetails, err := appStore.App.GetBuildZipNameByArch(path, arch, dontCheckArch)
	if err != nil {
		return nil, err
	}
	if buildDetails == nil {
		return nil, errors.New(fmt.Sprintf("failed to match build zip name app:%s version:%s arch:%s", appName, version, arch))
	}
	fileName := buildDetails.ZipName
	//listStore, err := client.ListStore()
	//if err != nil {
	//	return nil, err
	//}

	fileAndPath := appStore.FilePath(fmt.Sprintf("%s/%s", path, fileName))
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file:%s err:%s", fileAndPath, err.Error()))
	}
	uploadApp, err := client.AddUploadStoreApp(appName, version, product, arch, fileName, reader)
	if err != nil {
		return nil, err
	}
	return uploadApp, err
}

func (app *App) assistStoreListPlugins(connUUID string) ([]installer.BuildDetails, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreListPlugins()
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (app *App) assistStoreUploadPlugin(connUUID string, body *appstore.Plugin) (*appstore.UploadResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	f, flowPlugin, err := app.storeGetPlugin(body)
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreUploadPlugin(flowPlugin.ZipName, f)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
