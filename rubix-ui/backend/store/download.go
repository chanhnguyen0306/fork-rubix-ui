package store

import (
	"errors"
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"os"
	"path"
	"strings"
)

const flow = "flow-framework"
const rubixWires = "rubix-wires"
const wiresBuilds = "wires-builds"

func (inst *Store) GenerateDownloadOptions(repo string, doNotValidateArch bool) git.DownloadOptions {
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
func (inst *Store) DownloadAll(token string, cleanDownload bool, release *Release) ([]App, error) {
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
func (inst *Store) DownloadFlowPlugin(token, version, pluginName, arch, releaseVersion string, cleanDownload bool) (*App, error) {
	app, err := inst.gitDownloadZip(token, flow, version, flow, arch, releaseVersion, cleanDownload, false, true, git.DownloadOptions{
		AssetName: pluginName,
		MatchName: true,
		MatchArch: true,
	})
	if err != nil {
		return nil, err
	}
	return app, nil
}

// UnPackWires wires build is different to the go-lang or python builds as its zipped in a 2nd folder
// this will unzip and re-zip the build to match the other apps
func (inst *Store) UnPackWires(version string) error {
	path_ := inst.GetAppStoreAppPath(rubixWires, "", version)
	unzipPath := fmt.Sprintf("%s/%s", path_, version)
	f := fileutils.New()
	tmpDir, err := inst.makeUserPathTmpDir()
	if err != nil {
		return err
	}
	_, err = f.UnZip(unzipPath, tmpDir, os.FileMode(FilePerm))
	if err != nil {
		return err
	}
	files, err := f.ListFiles(tmpDir)
	if err != nil {
		return err
	}
	var wiresDir string
	for _, file := range files {
		if strings.Contains(file, "NubeIO-wires") {
			rubixPath := fmt.Sprintf("%s/%s", tmpDir, file)
			files, err = f.ListFiles(rubixPath)
			wiresDir = file
			if err != nil {
				return err
			}
			for _, file := range files {
				if strings.Contains(file, "rubix-wires") {
					reZipPath := fmt.Sprintf("%s/%s/%s", tmpDir, wiresDir, rubixWires)
					err := f.RecursiveZip(reZipPath, unzipPath)
					if err != nil {
						return err
					}
				}
			}
		}
	}
	err = f.RmRF(tmpDir)
	if err != nil {
		return err
	}
	return err

}

// GitDownloadZip download an app
func (inst *Store) GitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload bool, gitOptions git.DownloadOptions) (*App, error) {
	return inst.gitDownloadZip(token, appName, version, repo, arch, releaseVersion, isZipball, cleanDownload, false, gitOptions)
}

// gitDownloadZip download an app
func (inst *Store) gitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload, isPlugin bool, gitOptions git.DownloadOptions) (*App, error) {
	newApp := &App{
		Name:           appName,
		Version:        version,
		Repo:           repo,
		Arch:           arch,
		ReleaseVersion: releaseVersion,
	}
	if newApp.Name == "" {
		return nil, errors.New("download_app: app name can not be empty")
	}
	if newApp.Version == "" {
		return nil, errors.New("download_app: app version can not be empty")
	}
	if newApp.Repo == "" {
		return nil, errors.New("download_app: app repo can not be empty")
	}
	app, err := inst.AddApp(newApp)
	if err != nil {
		return nil, err
	}
	gitOptions.DownloadDestination = inst.GetAppStoreAppPath(newApp.Name, arch, newApp.Version)
	if isPlugin {
		gitOptions.DownloadDestination = path.Join(inst.GetAppStoreAppPath(newApp.Name, arch, newApp.Version), "plugins")
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
		if isZipball {
			err = inst.GitDownloadZipball(newApp.Repo, newApp.Version, arch, token, gitOptions)
		} else {
			err = inst.GitDownloadAsset(newApp.Repo, newApp.Version, arch, token, gitOptions)
		}
		if err != nil {
			return nil, err
		}
		return app, nil
	}
	return app, nil
}
