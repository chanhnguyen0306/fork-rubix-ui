package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	assistStore "github.com/NubeIO/rubix-assist/service/store"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
)

func (app *App) assistListStore(connUUID string) ([]assistStore.App, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.ListStore()
	if err != nil {
		return nil, err
	}
	return *resp, err
}

func (app *App) assistAddUploadApp(connUUID, appName, version, product, arch string, addIfExisting bool) (*assistStore.UploadResponse, error) {
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
	path := inst.GetAppPathAndVersion(appName, version)
	fmt.Println(path)
	var dontCheckArch bool
	if appName == rubixWires {
		dontCheckArch = true
	}
	buildDetails, err := appStore.App.GetBuildZipNameByArch(path, arch, dontCheckArch)
	if err != nil {
		return nil, err
	}
	//listStore, err := client.ListStore()
	//if err != nil {
	//	return nil, err
	//}

	fileName := buildDetails.ZipName
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
