package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"github.com/NubeIO/rubix-ui/backend/store"
	"path"
)

func (inst *App) StoreDownloadApp(token, appName, releaseVersion, arch string, cleanDownload bool) *store.InstallResponse {
	out := &store.InstallResponse{}
	getRelease, err := inst.addRelease(token, releaseVersion)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("release fetch got error: %s", err.Error()))
		return nil
	}
	for _, app := range getRelease.Apps {
		if app.Name == appName {
			asset, err := inst.appStore.GitDownloadZip(token, app.Name, app.Version, app.Repo, arch, app.DoNotValidateArch, app.IsZiball, cleanDownload)
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
				return path.Join(pluginPath, plg.ZipName), &plg, nil
			}
		}
	}
	return "", nil, errors.New(fmt.Sprintf("failed to find plugin: %s, version: %s, arch: %s", body.Name, body.Version, body.Arch))
}
