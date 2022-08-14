package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
	"path/filepath"
)

func (app *App) StoreDownloadAll(token, release string, cleanDownload bool) []store.App {
	out, err := app.downloadAll(token, release, cleanDownload)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error download apps:%s", err.Error()))
		return []store.App{}
	}
	return out
}

func (app *App) StoreCheckAppExists(appName string) error {
	inst := &store.Store{}
	appStore, err := store.New(inst)
	if err != nil {
		return err
	}
	return appStore.StoreCheckAppExists(appName)
}

func (app *App) StoreCheckAppAndVersionExists(appName, version string) error {
	inst := &store.Store{}
	appStore, err := store.New(inst)
	if err != nil {
		return err
	}
	return appStore.StoreCheckAppAndVersionExists(appName, version)
}

func (app *App) downloadAll(token, releaseVersion string, cleanDownload bool) ([]store.App, error) {
	inst := &store.Store{}
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
		Arch: arch,
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

func (app *App) storeGetPlugin(body *appstore.Plugin) (f *os.File, flowPlugin *installer.BuildDetails, err error) {
	path, flowPlugin, err := app.storeGetPluginPath(body)
	if err != nil {
		return nil, nil, err
	}
	fileAndPath := filepath.FromSlash(path)
	f, err = os.Open(fileAndPath)
	return f, flowPlugin, err
}

func (app *App) storeGetPluginPath(body *appstore.Plugin) (fullPath string, flowPlugin *installer.BuildDetails, err error) {
	var pluginPath string
	var name = body.PluginName
	var version = body.Version
	var arch = body.Arch
	if arch == "amd64" {
		plugins, path, err := app.storeListPluginsAmd64(version)
		if err != nil {
			return "", nil, err
		}
		for _, plg := range plugins {
			if plg.MatchedName == name {
				if plg.MatchedArch == arch {
					pluginPath = fmt.Sprintf("%s/%s", path, plg.ZipName)
					flowPlugin = &plg
				}

			}
		}
	}
	if arch == "armv7" {
		plugins, path, err := app.storeListPluginsArm(version)
		if err != nil {
			return "", nil, err
		}
		for _, plg := range plugins {
			if plg.MatchedArch == arch {
				pluginPath = fmt.Sprintf("%s/%s", path, plg.ZipName)
				flowPlugin = &plg
			}
		}
	}
	if pluginPath == "" {
		return "", nil, errors.New(fmt.Sprintf("failed to find plugin:%s version:%s arch:%s", name, version, arch))
	}
	return pluginPath, flowPlugin, nil

}

func (app *App) storeListPluginsAmd64(version string) ([]installer.BuildDetails, string, error) {
	inst := &store.Store{}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, "", nil
	}
	return appStore.StoreListPluginsAmd64(version)
}

func (app *App) storeListPluginsArm(version string) ([]installer.BuildDetails, string, error) {
	inst := &store.Store{}
	appStore, err := store.New(inst)
	if err != nil {
		return nil, "", nil
	}
	return appStore.StoreListPluginsArm(version)
}
