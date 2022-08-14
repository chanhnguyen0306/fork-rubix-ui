package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/store"
)

const flowFramework = "flow-framework"
const rubixWires = "rubix-wires"
const wiresBuilds = "wires-builds"

func (app *App) GetReleases() []store.Release {
	out, err := app.getReleases()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get releases:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) getReleases() ([]store.Release, error) {
	return app.DB.GetReleases()
}

func (app *App) GetRelease(uuid string) *store.Release {
	out, err := app.getRelease(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get release:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) getRelease(uuid string) (*store.Release, error) {
	return app.DB.GetRelease(uuid)
}

func (app *App) GetReleaseByVersion(version string) *store.Release {
	out, err := app.getReleaseByVersion(version)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get release by version:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) getReleaseByVersion(version string) (*store.Release, error) {
	v, err := app.DB.GetReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, errors.New(fmt.Sprintf("filed to find release by version:%s", version))
	}
	return v, nil

}

func (app *App) getAppFromReleases(version, appName string) (*store.Apps, error) {
	release, err := app.getReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	for _, apps := range release.Apps {
		if apps.Name == appName {
			return &apps, err
		}
	}
	return nil, errors.New(fmt.Sprintf("failed to find app by name:%s", appName))
}

func (app *App) AddRelease(token, version string) *store.Release {
	out, err := app.addRelease(token, version)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error add release:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) addRelease(token, version string) (*store.Release, error) {
	release, err := app.gitDownloadRelease(token, version)
	if err != nil {
		return nil, err
	}
	return app.DB.AddRelease(release)
}
