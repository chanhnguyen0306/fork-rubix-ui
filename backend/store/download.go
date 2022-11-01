package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
	"os"
)

const flow = "flow-framework"

func (inst *AppStore) DownloadFlowPlugin(token, version, pluginName, arch, releaseVersion string, cleanDownload bool) (*App, error) {
	app, err := inst.gitDownloadZip(token, flow, version, flow, arch, releaseVersion, false, cleanDownload, true, git.DownloadOptions{
		AssetName: pluginName,
		MatchName: true,
		MatchArch: true,
	})
	if err != nil {
		return nil, err
	}
	return app, nil
}

func (inst *AppStore) GitDownloadZip(token, appName, version, repo, arch, releaseVersion string, doNotValidateArch, isZipball, cleanDownload bool) (*App, error) {
	opts := git.DownloadOptions{
		MatchArch: !doNotValidateArch,
		AssetName: repo,
	}
	if !doNotValidateArch {
		opts.MatchName = true
	}
	return inst.gitDownloadZip(token, appName, version, repo, arch, releaseVersion, isZipball, cleanDownload, false, opts)
}

func (inst *AppStore) gitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload, isPlugin bool, gitOptions git.DownloadOptions) (*App, error) {
	app := App{
		Name:           appName,
		Version:        version,
		Repo:           repo,
		Arch:           arch,
		ReleaseVersion: releaseVersion,
	}
	if app.Name == "" {
		return nil, errors.New("download_app: app name can not be empty")
	}
	if app.Version == "" {
		return nil, errors.New("download_app: app version can not be empty")
	}
	if app.Repo == "" {
		return nil, errors.New("download_app: app repo can not be empty")
	}
	if err := os.MkdirAll(inst.GetAppStoreAppPath(app.Name, app.Arch, app.Version), os.FileMode(FilePerm)); err != nil {
		return nil, err
	}
	gitOptions.DownloadDestination = inst.GetAppStoreAppPath(app.Name, arch, app.Version)
	if isPlugin {
		gitOptions.DownloadDestination = inst.Store.UserPluginPath
	}
	var runDownload bool
	if cleanDownload {
		runDownload = true
	} else {
		path_ := inst.GetAppStoreAppPath(appName, arch, version)
		buildDetails, err := inst.App.GetBuildZipNameByArch(path_, arch, false)
		if err != nil {
			return nil, err
		}
		if buildDetails != nil {
			buildName := buildDetails.Name
			buildArch := buildDetails.Arch
			if buildName == gitOptions.AssetName && buildArch == arch {
				runDownload = false
			} else {
				runDownload = true
			}
		} else {
			runDownload = true
		}
	}
	if runDownload {
		var err error
		if isZipball {
			err = inst.gitDownloadZipball(app.Repo, app.Version, arch, token, gitOptions)
		} else {
			err = inst.gitDownloadAsset(app.Repo, app.Version, arch, token, gitOptions)
		}
		if err != nil {
			return nil, err
		}
		return &app, nil
	}
	return &app, nil
}
