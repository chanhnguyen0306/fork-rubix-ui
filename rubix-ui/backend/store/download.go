package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
)

const flow = "flow-framework"
const rubixWires = "rubix-wires"
const wiresBuilds = "wires-builds"

// DownloadAll make all the app store dirs
func (inst *Store) DownloadAll(token string, cleanDownload bool, release *Release) ([]App, error) {
	var out []App
	var archTypes = []string{"amd64", "armv7"}
	for _, archType := range archTypes { //download both arch types of FF
		app, err := inst.downloadApp(token, flow, release.Release, flow, archType, cleanDownload, git.DownloadOptions{
			AssetName: flow,
			MatchName: true,
			MatchArch: true,
		})
		if err != nil {
			return nil, err
		}
		out = append(out, *app)
	}
	for _, app := range release.Apps {
		if app.Name == rubixWires {
			app, err := inst.downloadApp(token, rubixWires, app.Version, wiresBuilds, "", cleanDownload, git.DownloadOptions{
				AssetName:     rubixWires,
				DownloadFirst: true,
			})
			if err != nil {
				return nil, err
			}
			out = append(out, *app)
		} else if len(app.Arch) > 0 {
			for _, arch := range app.Arch { // download both version of each app
				app, err := inst.downloadApp(token, app.Name, app.Version, app.Repo, arch, cleanDownload, git.DownloadOptions{
					AssetName: app.Repo,
					MatchName: true,
					MatchArch: true,
				})
				if err != nil {
					return nil, err
				}
				out = append(out, *app)
			}
		}
	}
	return out, nil
}

// DownloadApp download an app
func (inst *Store) DownloadApp(token, appName, version, repo, arch string, cleanDownload bool, gitOptions git.DownloadOptions) (*App, error) {
	return inst.downloadApp(token, appName, version, repo, arch, cleanDownload, gitOptions)
}

// DownloadApp download an app
func (inst *Store) downloadApp(token, appName, version, repo, arch string, cleanDownload bool, gitOptions git.DownloadOptions) (*App, error) {
	newApp := &App{
		Name:    appName,
		Version: version,
		Repo:    repo,
		Arch:    arch,
	}
	if newApp.Name == "" {
		return nil, errors.New("downloadApp: app name can not be empty")
	}
	if newApp.Version == "" {
		return nil, errors.New("downloadApp: app version can not be empty")
	}
	if newApp.Repo == "" {
		return nil, errors.New("downloadApp: app repo can not be empty")
	}
	app, err := inst.AddApp(newApp)
	if err != nil {
		return nil, err
	}
	gitOptions.DownloadDestination = inst.getAppPathAndVersion(newApp.Name, newApp.Version)
	var runDownload bool
	var buildNameMatch bool
	var buildArchMatch bool
	if cleanDownload {
		runDownload = true
	} else {
		path := inst.getAppPathAndVersion(appName, version)
		buildDetails, err := inst.App.GetBuildZipNameByArch(path, arch)
		if err != nil {
			return nil, err
		}
		if buildDetails != nil {
			buildName := buildDetails.MatchedName
			buildArch := buildDetails.MatchedArch
			if buildName == gitOptions.AssetName {
				buildNameMatch = true
			}
			if buildArch == arch {
				buildArchMatch = true
			}
			if buildNameMatch && buildArchMatch {
				runDownload = false
			} else {
				runDownload = true
			}
		} else {
			runDownload = true
		}
	}
	if runDownload {
		_, err = inst.GitDownload(newApp.Repo, newApp.Version, arch, token, gitOptions)
		if err != nil {
			return nil, err
		}
		return app, nil
	}
	return app, nil

}
