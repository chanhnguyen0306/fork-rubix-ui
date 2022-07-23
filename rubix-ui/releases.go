package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	assistStore "github.com/NubeIO/rubix-assist/service/store"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
)

func (app *App) assistListStore(connUUID string) ([]assistStore.App, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.ListStore()
	return *resp, err
}

func (app *App) assistAddApp(connUUID string, body *assistStore.App) (*assistStore.App, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.AddApp(body)
}

func (app *App) assistUploadApp(connUUID, appName, version string) (*assistStore.UploadResponse, error) {
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
	pprint.PrintJOSN(match)
	if err != nil {
		return nil, err
	}
	uploadApp, err := client.UploadApp(appName, version, name, reader)
	if err != nil {
		return nil, err
	}
	return uploadApp, err
}

func (app *App) getReleases() ([]store.Release, error) {
	return app.DB.GetReleases()
}

func (app *App) getRelease(uuid string) (*store.Release, error) {
	return app.DB.GetRelease(uuid)
}

func (app *App) getReleaseByVersion(version string) (*store.Release, error) {
	return app.DB.GetReleaseByVersion(version)
}

func (app *App) gitGetRelease(token, path string) (*store.Release, error) {
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    "armv7",
	}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, err
	}
	return appStore.DownLoadReleases(token, path)
}

func (app *App) addRelease(token, path string) (*store.Release, error) {
	release, err := app.gitGetRelease(token, path)
	if err != nil {
		return nil, err
	}
	return app.DB.AddRelease(release)
}

func (app *App) downloadAll(token, release, arch string) ([]store.App, error) {
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
	getRelease, err := app.getReleaseByVersion(release)
	if err != nil {
		return nil, err
	}
	if getRelease == nil {
		return nil, errors.New(fmt.Sprintf("failed to find release by version: %s", release))
	}
	downloaded, err := appStore.DownloadAll(token, arch, getRelease)
	if err != nil {
		return nil, err
	}
	return downloaded, err
}

func (app *App) downloadApp(token, release, appName, arch string) (*store.App, error) {
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
	getRelease, err := app.getReleaseByVersion(release)
	if err != nil {
		return nil, err
	}
	if getRelease == nil {
		return nil, errors.New(fmt.Sprintf("failed to find release by version: %s", release))
	}
	downloaded, err := appStore.DownloadApp(token, appName, arch, getRelease)
	if err != nil {
		return nil, err
	}
	return downloaded, err
}
