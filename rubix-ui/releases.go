package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/store"
)

const flowFramework = "flow-framework"
const rubixWires = "rubix-wires"
const wiresBuilds = "wires-builds"

func (app *App) GetReleases() []store.Release {
	out, err := app.getReleases()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get releases:%s", err.Error()))
		return nil
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

func (app *App) downloadAll(token, releaseVersion string, cleanDownload bool) ([]store.App, error) {
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
	}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, err
	}
	getRelease, err := app.getReleaseByVersion(releaseVersion)
	if err != nil {
		return nil, err
	}
	if getRelease == nil {
		return nil, errors.New(fmt.Sprintf("failed to find release by version: %s", releaseVersion))
	}
	downloaded, err := appStore.DownloadAll(token, cleanDownload, getRelease)
	if err != nil {
		return nil, err
	}
	return downloaded, err
}

type InstallAppAndPlugins struct {
	AppName    string
	AppVersion string
	Plugins    []string
}

func (app *App) StoreDownloadApp(token, appName, releaseVersion, arch string, cleanDownload bool) *InstallAppAndPlugins {
	out := &InstallAppAndPlugins{}
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
		Arch:    arch,
	}
	appStore, err := store.New(inst)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error init store err:%s", err.Error()))
		return nil
	}
	getRelease, err := app.getReleaseByVersion(releaseVersion)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("failed to find release by version: %s", releaseVersion))
		return nil
	}
	if getRelease == nil {
		app.crudMessage(false, fmt.Sprintf("failed to find release by version: %s", releaseVersion))
		return nil
	}
	for _, apps := range getRelease.Apps {
		if appName == rubixWires { // download wires
			asset, err := appStore.DownloadWires(token, apps.Version, cleanDownload)
			if err != nil {
				app.crudMessage(false, fmt.Sprintf("download rubix-wires err:%s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			app.crudMessage(true, fmt.Sprintf("download rubix-wires ok"))
		} else if apps.Name == appName { // download any other as needed
			opts := git.DownloadOptions{
				AssetName: apps.Repo,
				MatchName: true,
				MatchArch: true,
			}
			asset, err := appStore.GitDownloadAsset(token, apps.Name, apps.Version, apps.Repo, arch, releaseVersion, cleanDownload, opts)
			if err != nil {
				app.crudMessage(false, fmt.Sprintf("download app err:%s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			app.crudMessage(true, fmt.Sprintf("download app:%s ok", appName))
			if len(apps.PluginDependency) > 0 { // if required download any plugins
				for _, plugin := range apps.PluginDependency {
					_, err := appStore.DownloadFlowPlugin(token, getRelease.Release, plugin, arch, releaseVersion, cleanDownload)
					if err != nil {
						app.crudMessage(false, fmt.Sprintf("download plugin err:%s", err.Error()))
						return nil
					}
					app.crudMessage(true, fmt.Sprintf("download plugin:%s ok", plugin))
					out.Plugins = append(out.Plugins, plugin)
				}
			}
		}
	}
	return out
}