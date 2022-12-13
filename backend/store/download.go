package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"os"
)

func (inst *AppStore) DownloadFlowPlugin(token string, app App) (*App, error) {
	app.Repo = constants.FlowFramework
	return inst.gitDownloadZip(token, app, false, true, git.DownloadOptions{
		AssetName: app.Name,
		MatchName: true,
		MatchArch: true,
	})
}

func (inst *AppStore) GitDownloadZip(token string, app App, doNotValidateArch, isZipball bool) (
	*App, error) {
	opts := git.DownloadOptions{
		MatchArch: !doNotValidateArch,
		AssetName: app.Repo,
	}
	if !doNotValidateArch {
		opts.MatchName = true
	}
	return inst.gitDownloadZip(token, app, isZipball, false, opts)
}

func (inst *AppStore) gitDownloadZip(token string, app App, isZipball, isPlugin bool, gitOptions git.DownloadOptions) (
	*App, error) {
	if app.Name == "" {
		return nil, errors.New("download_app: app name can not be empty")
	}
	if app.Version == "" {
		return nil, errors.New("download_app: app version can not be empty")
	}
	if app.Repo == "" {
		return nil, errors.New("download_app: app repo can not be empty")
	}

	gitOptions.DownloadDestination = inst.GetAppStoreAppPath(app.Name, app.Arch, app.Version)
	if isPlugin {
		gitOptions.DownloadDestination = inst.Store.UserPluginPath
	}

	if err := os.MkdirAll(gitOptions.DownloadDestination, os.FileMode(FilePerm)); err != nil {
		return nil, err
	}

	var err error
	if isZipball {
		err = inst.gitDownloadZipball(app.Repo, app.Version, app.Arch, token, gitOptions)
	} else {
		err = inst.gitDownloadAsset(app.Repo, app.Version, app.Arch, token, gitOptions)
	}
	if err != nil {
		return nil, err
	}
	return &app, nil
}
