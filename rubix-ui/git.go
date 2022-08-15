package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

func (inst *App) GitListReleases(token string) []store.ReleaseList {
	out, err := inst.gitListReleases(token)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error list relases:%s", err.Error()))
		return []store.ReleaseList{}
	}
	return out
}

//gitListReleases gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (inst *App) gitListReleases(token string) ([]store.ReleaseList, error) {
	str := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    "",
	}
	appStore, err := store.New(str)
	if err != nil {
		return nil, err
	}
	return appStore.GitListReleases(token)
}

func (inst *App) GitDownloadRelease(token, version string) *store.Release {
	out, err := inst.gitDownloadRelease(token, version)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error download relase:%s", err.Error()))
		return nil
	}
	return out
}

//gitGetRelease gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (inst *App) gitDownloadRelease(token, path string) (*store.Release, error) {
	str := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    "",
	}
	appStore, err := store.New(str)
	if err != nil {
		return nil, err
	}
	return appStore.DownLoadReleases(token, path)
}
