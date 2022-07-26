package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	assistStore "github.com/NubeIO/rubix-assist/service/store"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
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

func (app *App) assistAddUploadApp(connUUID, appName, version string) (*assistStore.UploadResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    "",
	}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, err
	}
	name, path, match, err := appStore.GetAppZipName(appName, version)
	if err != nil {
		return nil, err
	}
	fileAndPath := appStore.FilePath(fmt.Sprintf("%s/%s", path, name))
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file:%s err:%s", fileAndPath, err.Error()))
	}
	log.Errorln("assistUploadApp() ADD IN MATCH CHECK FOR APP INSTALLER")
	pprint.PrintJOSN(match)
	if err != nil {
		return nil, err
	}
	uploadApp, err := client.AddUploadStoreApp(appName, version, name, reader)
	if err != nil {
		return nil, err
	}
	return uploadApp, err
}
