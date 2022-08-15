package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
)

func (inst *App) assistListStore(connUUID string) ([]appstore.ListApps, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.ListAppsWithVersions()
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) assistAddUploadApp(connUUID, appName, version, product, arch string) (*appstore.UploadResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	str := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    arch,
	}
	appStore, err := store.New(str)
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
	path := str.GetAppPathAndVersion(appName, version)
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

func (inst *App) assistStoreListPlugins(connUUID string) ([]installer.BuildDetails, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreListPlugins()
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) assistStoreUploadPlugin(connUUID string, body *appstore.Plugin) (*appstore.UploadResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	f, flowPlugin, err := inst.storeGetPlugin(body)
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreUploadPlugin(flowPlugin.ZipName, f)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
