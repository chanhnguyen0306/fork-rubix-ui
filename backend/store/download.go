package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
)

const flow = "flow-framework"

func (inst *store) GenerateDownloadOptions(repo string, doNotValidateArch bool) git.DownloadOptions {
	opts := git.DownloadOptions{
		MatchArch: !doNotValidateArch,
		AssetName: repo,
	}
	if !doNotValidateArch {
		opts.MatchName = true
	}
	return opts
}

// DownloadAll make all the app store dirs
func (inst *store) DownloadAll(token string, cleanDownload bool, release *Release) ([]App, error) {
	var out []App
	for _, app := range release.Apps { // download all others apps
		opts := inst.GenerateDownloadOptions(app.Repo, app.DoNotValidateArch)
		if len(app.Arch) > 0 {
			for _, arch := range app.Arch { // download both version of each app
				opts.MatchName = true
				opts.AssetName = app.Repo
				app_, err := inst.gitDownloadZip(token, app.Name, app.Version, app.Repo, arch, "", app.IsZiball, cleanDownload, false, opts)
				if err != nil {
					return nil, err
				}
				out = append(out, *app_)
			}
		} else {
			app_, err := inst.gitDownloadZip(token, app.Name, app.Version, app.Repo, "", "", app.IsZiball, cleanDownload, false, opts)
			if err != nil {
				return nil, err
			}
			out = append(out, *app_)
		}
	}
	return out, nil
}

// DownloadFlowPlugin download ff
func (inst *store) DownloadFlowPlugin(token, version, pluginName, arch, releaseVersion string, cleanDownload bool) (*App, error) {
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

// GitDownloadZip download an app
func (inst *store) GitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload bool, gitOptions git.DownloadOptions) (*App, error) {
	return inst.gitDownloadZip(token, appName, version, repo, arch, releaseVersion, isZipball, cleanDownload, false, gitOptions)
}

// gitDownloadZip download an app
func (inst *store) gitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload, isPlugin bool, gitOptions git.DownloadOptions) (*App, error) {
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
	err := inst.AddApp(&app)
	if err != nil {
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
			err = inst.GitDownloadZipball(app.Repo, app.Version, arch, token, gitOptions)
		} else {
			err = inst.GitDownloadAsset(app.Repo, app.Version, arch, token, gitOptions)
		}
		if err != nil {
			return nil, err
		}
		return &app, nil
	}
	return &app, nil
}
