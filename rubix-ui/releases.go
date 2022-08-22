package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/store"
)

const flowFramework = "flow-framework"
const rubixWires = "rubix-wires"
const wiresBuilds = "wires-builds"

func (inst *App) GetReleases() []store.Release {
	out, err := inst.getReleases()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error get releases:%s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getReleases() ([]store.Release, error) {
	return inst.DB.GetReleases()
}

func (inst *App) GetRelease(uuid string) *store.Release {
	out, err := inst.getRelease(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error get release:%s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getRelease(uuid string) (*store.Release, error) {
	return inst.DB.GetRelease(uuid)
}

func (inst *App) GetReleaseByVersion(version string) *store.Release {
	out, err := inst.getReleaseByVersion(version)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error get release by version:%s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getReleaseByVersion(version string) (*store.Release, error) {
	v, err := inst.DB.GetReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, errors.New(fmt.Sprintf("filed to find release by version:%s", version))
	}
	return v, nil

}

func (inst *App) getAppFromReleases(version, appName string) (*store.Apps, error) {
	release, err := inst.getReleaseByVersion(version)
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

func (inst *App) AddRelease(token, version string) *store.Release {
	out, err := inst.addRelease(token, version)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error add release:%s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) addRelease(token, version string) (*store.Release, error) {
	release, err := inst.gitDownloadRelease(token, version)
	if err != nil {
		return nil, err
	}
	return inst.DB.AddRelease(release)
}

func (inst *App) dropReleases() error {
	releases, err := inst.getReleases()
	if err != nil {
		return err
	}
	for _, release := range releases {
		err := inst.DB.DeleteRelease(release.Uuid)
		if err != nil {
			return err
		}
	}
	return nil
}

func (inst *App) deleteRelease(version string) error {
	err := inst.DB.DeleteRelease(version)
	if err != nil {
		return err
	}
	return nil
}
