package store

import (
	"errors"
)

const flow = "flow-framework"

// DownloadAll make all the app store dirs
func (inst *Store) DownloadAll(token, arch string, release *Release) ([]App, error) {
	var out []App
	app, err := inst.DownloadApp(token, flow, arch, release)
	if err != nil {
		return nil, err
	}
	out = append(out, *app)
	for _, app := range release.Apps {
		app, err := inst.DownloadApp(token, app.Name, arch, release)
		if err != nil {
			return nil, err
		}
		out = append(out, *app)
	}
	return out, err
}

// DownloadApp download an app
func (inst *Store) DownloadApp(token, appName, arch string, release *Release) (*App, error) {
	newApp := &App{}
	for _, app := range release.Apps {
		if appName == flow {
			newApp.Name = release.Name
			newApp.Version = release.Release
			newApp.Repo = release.Repo
		} else {
			if app.Name == appName {
				newApp.Name = app.Name
				newApp.Version = app.Version
				newApp.Repo = app.Repo
			}
		}
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
	path := inst.getAppPathAndVersion(newApp.Name, newApp.Version)
	_, err = inst.GitDownload(newApp.Repo, newApp.Version, arch, path, token)
	if err != nil {
		return nil, err
	}
	return app, nil
}
