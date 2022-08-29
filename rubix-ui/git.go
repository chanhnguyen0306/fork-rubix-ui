package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
	"strings"
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

func (inst *App) gitDownloadAllRelease(runDownloads bool) error {
	if !runDownloads {
		return nil
	}
	gitToken, err := inst.getGitToken("set_123456789ABC", false)
	if err != nil {
		return err
	}
	releases, err := inst.gitListReleases(gitToken)
	if err != nil {
		return err
	}
	for _, release := range releases {
		downloadRelease, err := inst.gitDownloadRelease(gitToken, release.Path)
		if err != nil {
			return err
		}
		log.Infof("git downloaded release:%s", downloadRelease.Release)
	}
	return nil

}

//gitGetRelease gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (inst *App) gitDownloadRelease(token, path string) (*store.Release, error) {
	if strings.Contains(path, "flow/") {
	} else {
		path = fmt.Sprintf("flow/%s.json", path)
	}
	str := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    "armv7",
	}
	appStore, err := store.New(str)
	if err != nil {
		return nil, err
	}
	return appStore.DownLoadReleases(token, path)
}
