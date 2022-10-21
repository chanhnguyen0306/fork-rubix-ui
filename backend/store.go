package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
	"path"
)

func (inst *App) StoreCheckAppExists(appName string) error {
	return inst.store.StoreCheckAppExists(appName)
}

func (inst *App) StoreCheckAppAndVersionExists(appName, arch, version string) error {
	return inst.store.StoreCheckAppAndVersionExists(appName, arch, version)
}

func (inst *App) storeDownloadPlugins(token, appName, releaseVersion, arch string, cleanDownload bool, release *store.Release) (*store.InstallResponse, error) {
	out := &store.InstallResponse{}
	if release == nil {
		return nil, errors.New("download-plugins release can not be empty")
	}
	if appName == constants.FlowFramework { // just download all plugins
		for _, plugin := range release.Plugins {
			inst.crudMessage(true, fmt.Sprintf("try to download plugin: %s version: %s", plugin.Plugin, release.Release))
			_, err := inst.store.DownloadFlowPlugin(token, release.Release, plugin.Plugin, arch, releaseVersion, cleanDownload)
			if err != nil {
				inst.crudMessage(false, fmt.Sprintf("download plugin err: %s", err.Error()))
				return nil, err
			}
			out.Plugins = append(out.Plugins, plugin.Plugin)
		}
	}
	for _, app := range release.Apps {
		if app.Name == appName {
			if len(app.PluginDependency) > 0 { // if required download any plugins
				for _, plugin := range app.PluginDependency {
					inst.crudMessage(true, fmt.Sprintf("try to download plugin: %s version: %s", plugin, release.Release))
					_, err := inst.store.DownloadFlowPlugin(token, release.Release, plugin, arch, releaseVersion, cleanDownload)
					if err != nil {
						inst.crudMessage(false, fmt.Sprintf("download plugin err: %s", err.Error()))
						return nil, err
					}
					inst.crudMessage(true, fmt.Sprintf("download plugin: %s ok", plugin))
					out.Plugins = append(out.Plugins, plugin)
				}
			}
		}
	}
	return out, nil
}

func (inst *App) StoreDownloadApp(token, appName, releaseVersion, arch string, cleanDownload bool) *store.InstallResponse {
	out := &store.InstallResponse{}
	inst.crudMessage(true, fmt.Sprintf("try and download app: %s release: %s", appName, releaseVersion))
	getRelease, err := inst.addRelease(token, releaseVersion)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error download release err: %s", err.Error()))
		return nil
	}
	for _, app := range getRelease.Apps {
		if app.Name == appName {
			inst.crudMessage(true, fmt.Sprintf("try to download app: %s version: %s", app.Name, app.Version))
			opts := inst.store.GenerateDownloadOptions(app.Repo, app.DoNotValidateArch)
			asset, err := inst.store.GitDownloadZip(token, app.Name, app.Version, app.Repo, arch, releaseVersion, app.IsZiball, cleanDownload, opts)
			if err != nil {
				inst.crudMessage(false, fmt.Sprintf("download app err: %s", err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			inst.crudMessage(true, fmt.Sprintf("download app: %s ok", appName))
			downloadPlugins, err := inst.storeDownloadPlugins(token, appName, releaseVersion, arch, cleanDownload, getRelease)
			if err != nil {
				inst.crudMessage(false, fmt.Sprintf("download app err: %s", err.Error()))
				return nil
			}
			if downloadPlugins != nil {
				out.Plugins = downloadPlugins.Plugins
			}
		}
	}
	return out
}

func (inst *App) storeGetPlugin(body *appstore.Plugin) (f *os.File, flowPlugin *installer.BuildDetails, err error) {
	_path, flowPlugin, err := inst.storeGetPluginPath(body)
	if err != nil {
		return nil, nil, err
	}
	f, err = os.Open(_path)
	return f, flowPlugin, err
}

func (inst *App) storeGetPluginPath(body *appstore.Plugin) (fullPath string, flowPlugin *installer.BuildDetails, err error) {
	plugins, pluginPath, err := inst.store.StoreListPlugins()
	if err != nil {
		return "", nil, err
	}
	for _, plg := range plugins {
		if plg.Name == body.Name {
			if plg.Arch == body.Arch {
				return path.Join(pluginPath, plg.ZipName), &plg, nil
			}
		}
	}
	return "", nil, errors.New(fmt.Sprintf("failed to find plugin: %s, version: %s, arch: %s", body.Name, body.Version, body.Arch))
}
