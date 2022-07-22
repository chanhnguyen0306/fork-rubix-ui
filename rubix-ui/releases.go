package main

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

func (app *App) getRelease(token, path string) (*store.Release, error) {
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
	release, err := app.getRelease(token, path)
	if err != nil {
		return nil, err
	}
	return app.DB.AddRelease(release)
}
