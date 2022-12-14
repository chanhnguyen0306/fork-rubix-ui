package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"github.com/NubeIO/rubix-ui/backend/store"
	"path"
)

func (inst *App) StoreDownloadApp(token, releaseVersion, appName, appVersion, arch string) *store.InstallResponse {
	out := &store.InstallResponse{}
	getRelease, err := inst.addRelease(token, releaseVersion)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("release fetch got error: %s", err.Error()))
		return nil
	}
	for _, app := range getRelease.Apps {
		if app.Name == appName {
			_app := store.App{
				Name:    appName,
				Version: appVersion,
				Arch:    arch,
			}
			asset, err := inst.appStore.GitDownloadZip(token, _app, app.DoNotValidateArch, app.IsZiball)
			if err != nil {
				inst.uiErrorMessage(fmt.Sprintf("%s app download on local store got error: %s", appName, err.Error()))
				return nil
			}
			out.AppName = asset.Name
			out.AppVersion = asset.Version
			inst.uiSuccessMessage(fmt.Sprintf("%s app downloaded successfully", appName))
		}
	}
	return out
}

func (inst *App) storeGetPluginPath(body *amodel.Plugin) (absPath string, flowPlugin *builds.BuildDetails, err error) {
	plugins, pluginPath, err := inst.appStore.StoreListPlugins()
	if err != nil {
		return "", nil, err
	}
	for _, plg := range plugins {
		if plg.Name == body.Name {
			if plg.Arch == body.Arch {
				if plg.Version == body.Version {
					return path.Join(pluginPath, plg.ZipName), &plg, nil
				}
			}
		}
	}
	return "", nil, errors.New(fmt.Sprintf("failed to find plugin: %s, version: %s, arch: %s", body.Name, body.Version, body.Arch))
}
