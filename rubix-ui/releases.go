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
	v, err := app.DB.GetReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, errors.New(fmt.Sprintf("filed to find release by version:%s", version))
	}
	return v, nil

}

func (app *App) getAppFromReleases(version, appName string) (*store.Apps, error) {
	release, err := app.getReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	for _, apps := range release.Apps {
		if apps.Name == appName {
			return &apps, err
		}
	}
	return nil, errors.New(fmt.Sprintf("failed to find app by name:%s", appName))
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

func (app *App) StoreCheckAppExists(appName string) error {
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
	}
	appStore, err := store.New(inst)
	if err != nil {
		return err
	}
	return appStore.StoreCheckAppExists(appName)
}

func (app *App) StoreCheckAppAndVersionExists(appName, version string) error {
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
	}
	appStore, err := store.New(inst)
	if err != nil {
		return err
	}
	return appStore.StoreCheckAppAndVersionExists(appName, version)
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

func (app *App) StoreDownloadApp(token, appName, releaseVersion, arch string, cleanDownload bool) *store.InstallResponse {
	out := &store.InstallResponse{}
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
	app.crudMessage(true, fmt.Sprintf("try and download apps release:%s", releaseVersion))
	path := fmt.Sprintf("flow/%s.json", releaseVersion)
	getRelease, err := app.addRelease(token, path)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error download release err:%s", err.Error()))
		return nil
	}
	getRelease, err = app.getReleaseByVersion(releaseVersion)
	if getRelease == nil {
		app.crudMessage(false, fmt.Sprintf("failed to find release by version: %s", releaseVersion))
		return nil
	}
	for _, apps := range getRelease.Apps {
		if appName == rubixWires && apps.Name == rubixWires { // download wires
			app.crudMessage(true, fmt.Sprintf("try to download app:%s version:%s", appName, apps.Version))
			asset, err := appStore.DownloadWires(token, apps.Version, cleanDownload)
			if err != nil {
				app.crudMessage(false, fmt.Sprintf("download rubix-wires err:%s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			app.crudMessage(true, fmt.Sprintf("download app:%s ok", appName))
		} else if apps.Name == appName { // download any other as needed
			opts := git.DownloadOptions{
				AssetName: apps.Repo,
				MatchName: true,
				MatchArch: true,
			}
			app.crudMessage(true, fmt.Sprintf("try to download app:%s version:%s", appName, apps.Version))
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
					app.crudMessage(true, fmt.Sprintf("try to download plugin:%s version:%s", plugin, getRelease.Release))
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
