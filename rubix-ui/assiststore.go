package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"os"
	"path"
)

func (inst *App) assistListStore(connUUID string) ([]appstore.ListApps, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.ListAppsWithVersions()
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) assistAddUploadApp(connUUID, appName, version, arch string, doNotValidateArch bool) (*appstore.UploadResponse, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	err = inst.store.StoreCheckAppExists(appName)
	if err != nil {
		return nil, err
	}
	err = inst.store.StoreCheckAppAndVersionExists(appName, arch, version)
	if err != nil {
		return nil, err
	}
	p := inst.store.GetAppStoreAppPath(appName, arch, version)
	buildDetails, err := inst.store.App.GetBuildZipNameByArch(p, arch, doNotValidateArch)
	if err != nil {
		return nil, err
	}
	if buildDetails == nil {
		return nil, errors.New(fmt.Sprintf("failed to match build zip name app: %s version: %s arch: %s", appName, version, arch))
	}

	fileName := buildDetails.ZipName
	fileAndPath := path.Join(p, fileName)
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file: %s err: %s", fileAndPath, err.Error()))
	}
	uploadApp, err := client.UploadAddOnAppStore(appName, version, arch, fileName, reader)
	if err != nil {
		return nil, err
	}
	return uploadApp, err
}

func (inst *App) assistStoreListPlugins(connUUID string) ([]installer.BuildDetails, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
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
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
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
