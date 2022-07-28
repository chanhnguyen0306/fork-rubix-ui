package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

func (app *App) GitListReleases(token string) []store.ReleaseList {
	out, err := app.gitListReleases(token)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error list relases:%s", err.Error()))
		return []store.ReleaseList{}
	}
	return out
}

//gitListReleases gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (app *App) gitListReleases(token string) ([]store.ReleaseList, error) {
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
	return appStore.GitListReleases(token)
}

func (app *App) GitDownloadRelease(token, version string) *store.Release {
	out, err := app.gitDownloadRelease(token, version)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error download relase:%s", err.Error()))
		return nil
	}
	return out
}

//gitGetRelease gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (app *App) gitDownloadRelease(token, path string) (*store.Release, error) {
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
	return appStore.DownLoadReleases(token, path)
}

func (app *App) GetGitToken() string {
	out, err := app.getGitToken()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get git token:%s", err.Error()))
		return ""
	}
	return out
}

func (app *App) getGitToken() (string, error) {
	out, err := app.DB.GetGitToken()
	if err != nil {
		return "", err
	}
	return out, nil
}
