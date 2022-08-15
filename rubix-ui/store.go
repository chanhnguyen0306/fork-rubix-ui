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

func (inst *App) StoreCheckAppExists(appName string) error {
	return inst.store.StoreCheckAppExists(appName)
}

func (inst *App) StoreCheckAppAndVersionExists(appName, version string) error {
	return inst.store.StoreCheckAppAndVersionExists(appName, version)
}

func (inst *App) StoreDownloadApp(token, appName, releaseVersion, arch string, cleanDownload bool) *store.InstallResponse {
	out := &store.InstallResponse{}
	inst.store.Arch = arch
	inst.crudMessage(true, fmt.Sprintf("try and download apps release:%s", releaseVersion))
	path := fmt.Sprintf("flow/%s.json", releaseVersion)
	getRelease, err := inst.addRelease(token, path)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error download release err:%s", err.Error()))
		return nil
	}
	for _, apps := range getRelease.Apps {
		if appName == rubixWires && apps.Name == rubixWires { // download wires
			inst.crudMessage(true, fmt.Sprintf("try to download app:%s version:%s", appName, apps.Version))
			asset, err := inst.store.DownloadWires(token, apps.Version, cleanDownload)
			if err != nil {
				inst.crudMessage(false, fmt.Sprintf("download rubix-wires err:%s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			inst.crudMessage(true, fmt.Sprintf("download app:%s ok", appName))
		} else if apps.Name == appName { // download any other as needed
			opts := git.DownloadOptions{
				AssetName: apps.Repo,
				MatchName: true,
				MatchArch: true,
			}
			inst.crudMessage(true, fmt.Sprintf("try to download app:%s version:%s", appName, apps.Version))
			asset, err := inst.store.GitDownloadAsset(token, apps.Name, apps.Version, apps.Repo, arch, releaseVersion, cleanDownload, opts)
			if err != nil {
				inst.crudMessage(false, fmt.Sprintf("download app err:%s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			inst.crudMessage(true, fmt.Sprintf("download app:%s ok", appName))
			if len(apps.PluginDependency) > 0 { // if required download any plugins
				for _, plugin := range apps.PluginDependency {
					inst.crudMessage(true, fmt.Sprintf("try to download plugin:%s version:%s", plugin, getRelease.Release))
					_, err := inst.store.DownloadFlowPlugin(token, getRelease.Release, plugin, arch, releaseVersion, cleanDownload)
					if err != nil {
						inst.crudMessage(false, fmt.Sprintf("download plugin err:%s", err.Error()))
						return nil
					}
					inst.crudMessage(true, fmt.Sprintf("download plugin:%s ok", plugin))
					out.Plugins = append(out.Plugins, plugin)
				}
			}
		}
	}
	return out
}

func (inst *App) storeGetPlugin(body *appstore.Plugin) (f *os.File, flowPlugin *installer.BuildDetails, err error) {
	path, flowPlugin, err := inst.storeGetPluginPath(body)
	if err != nil {
		return nil, nil, err
	}
	fileAndPath := filepath.FromSlash(path)
	f, err = os.Open(fileAndPath)
	return f, flowPlugin, err
}

func (inst *App) storeGetPluginPath(body *appstore.Plugin) (fullPath string, flowPlugin *installer.BuildDetails, err error) {
	var pluginPath string
	var name = body.PluginName
	var version = body.Version
	var arch = body.Arch
	if arch == "amd64" {
		plugins, path, err := inst.storeListPluginsAmd64(version)
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
		plugins, path, err := inst.storeListPluginsArm(version)
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

func (inst *App) storeListPluginsAmd64(version string) ([]installer.BuildDetails, string, error) {
	return inst.store.StoreListPluginsAmd64(version)
}

func (inst *App) storeListPluginsArm(version string) ([]installer.BuildDetails, string, error) {
	return inst.store.StoreListPluginsArm(version)
}
