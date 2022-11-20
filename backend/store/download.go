package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"os"
)

const flow = "flow-framework"

func (inst *AppStore) DownloadFlowPlugin(token, version, pluginName, arch string, cleanDownload bool) (*App, error) {
	app, err := inst.gitDownloadZip(token, flow, version, flow, arch, false, cleanDownload, true, git.DownloadOptions{
		AssetName: pluginName,
		MatchName: true,
		MatchArch: true,
	})
	if err != nil {
		return nil, err
	}
	return app, nil
}

func (inst *AppStore) GitDownloadZip(token, appName, version, repo, arch string, doNotValidateArch, isZipball, cleanDownload bool) (*App, error) {
	opts := git.DownloadOptions{
		MatchArch: !doNotValidateArch,
		AssetName: repo,
	}
	if !doNotValidateArch {
		opts.MatchName = true
	}
	return inst.gitDownloadZip(token, appName, version, repo, arch, isZipball, cleanDownload, false, opts)
}

func (inst *AppStore) gitDownloadZip(token, appName, version, repo, arch string, isZipball, cleanDownload, isPlugin bool, gitOptions git.DownloadOptions) (*App, error) {
	app := App{
		Name:    appName,
		Version: version,
		Repo:    repo,
		Arch:    arch,
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
	gitOptions.DownloadDestination = inst.GetAppStoreAppPath(app.Name, arch, app.Version)
	if isPlugin {
		gitOptions.DownloadDestination = inst.Store.UserPluginPath
	}
	if err := os.MkdirAll(gitOptions.DownloadDestination, os.FileMode(FilePerm)); err != nil {
		return nil, err
	}
	var runDownload bool
	if cleanDownload {
		runDownload = true
	} else {
		path_ := inst.GetAppStoreAppPath(appName, arch, version)
		buildDetails, err := builds.GetBuildZipNameByArch(path_, arch, false)
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
