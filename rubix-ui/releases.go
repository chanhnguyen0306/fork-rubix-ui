package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

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
		Arch:    "armv7",
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
		Arch:    "armv7",
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
