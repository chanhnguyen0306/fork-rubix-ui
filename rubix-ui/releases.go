package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

func (app *App) GetReleases() []store.Release {
	out, err := app.getReleases()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get releases:%s", err.Error()))
		return []store.Release{}
	}
	return out
}

func (app *App) getReleases() ([]store.Release, error) {
	return app.DB.GetReleases()
}

func (app *App) GetRelease(uuid string) *store.Release {
	out, err := app.getRelease(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get release:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) getRelease(uuid string) (*store.Release, error) {
	return app.DB.GetRelease(uuid)
}

func (app *App) GetReleaseByVersion(version string) *store.Release {
	out, err := app.getReleaseByVersion(version)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get release by version:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) getReleaseByVersion(version string) (*store.Release, error) {
	return app.DB.GetReleaseByVersion(version)
}

func (app *App) AddRelease(token, version string) *store.Release {
	out, err := app.addRelease(token, version)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error add release:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) addRelease(token, version string) (*store.Release, error) {
	release, err := app.gitDownloadRelease(token, version)
	if err != nil {
		return nil, err
	}
	return app.DB.AddRelease(release)
}

func (app *App) StoreDownloadAll(token, release string, cleanDownload bool) []store.App {
	out, err := app.downloadAll(token, release, cleanDownload)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error download apps:%s", err.Error()))
		return []store.App{}
	}
	return out
}

func (app *App) downloadAll(token, release string, cleanDownload bool) ([]store.App, error) {
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
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
	downloaded, err := appStore.DownloadAll(token, cleanDownload, getRelease)
	if err != nil {
		return nil, err
	}
	return downloaded, err
}

func (app *App) StoreDownloadApp(token, appName, version, repo, arch string) *store.App {
	out, err := app.downloadApp(token, appName, version, repo, arch)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error download app:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) downloadApp(token, appName, version, repo, arch string) (*store.App, error) {
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
	downloaded, err := appStore.DownloadApp(token, appName, version, repo, arch, false, git.DownloadOptions{})
	if err != nil {
		return nil, err
	}
	return downloaded, err
}
