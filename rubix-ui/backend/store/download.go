package store

import (
	"errors"
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
)

// DownloadAll make all the app store dirs
func (inst *Store) DownloadAll(token string, rel *Release) (*App, error) {

	//for i, app := range rel.Apps {
	//
	//}
	//
	//
	//return app, nil
	return nil, nil
}

// DownloadApp download an app
func (inst *Store) DownloadApp(token, appName, arch string, rel *Release) (*App, error) {
	newApp := &App{}
	for _, app := range rel.Apps {
		if appName == "flow-framework" {
			newApp.Name = rel.Name
			newApp.Version = rel.Release
			newApp.Repo = rel.Repo
		} else {
			if app.Name == appName {
				newApp.Name = app.Name
				newApp.Version = app.Version
				newApp.Repo = app.Repo
			}
		}

	}
	if newApp.Name == "" {
		return nil, errors.New("app name can not be empty")
	}
	if newApp.Version == "" {

	}
	if newApp.Repo == "" {

	}
	pprint.PrintJOSN(newApp)
	app, err := inst.AddApp(newApp)
	fmt.Println(4444, err)
	if err != nil {
		return nil, err
	}
	path := inst.getAppPathAndVersion(newApp.Name, newApp.Version)
	_, err = inst.GitDownload(newApp.Repo, newApp.Version, arch, path, token)
	fmt.Println(5555, err)
	if err != nil {
		return nil, err
	}
	return app, nil
}
