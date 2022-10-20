package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/store"
	"github.com/hashicorp/go-version"
	"sort"
)

func (inst *App) GetReleases() []store.Release {
	out, err := inst.getReleases()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error get releases: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getReleases() ([]store.Release, error) {
	return inst.DB.GetReleases()
}

func (inst *App) getLatestRelease() (string, error) {
	releases, err := inst.DB.GetReleases()
	if err != nil {
		return "", err
	}
	var versionsRaw []string
	for _, release := range releases {
		versionsRaw = append(versionsRaw, release.Release)
	}
	versions := make([]*version.Version, len(versionsRaw))
	for i, raw := range versionsRaw {
		v, _ := version.NewVersion(raw)
		versions[i] = v
	}
	// After this, the versions are properly sorted
	sort.Sort(version.Collection(versions))
	if len(versions) > 0 {
		return fmt.Sprintf("v%s", versions[len(versions)-1].String()), nil
	} else {
		return "", nil
	}

}

func (inst *App) GetRelease(uuid string) *store.Release {
	out, err := inst.getRelease(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error get release: %s", err.Error()))
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
		inst.crudMessage(false, fmt.Sprintf("error get release by version: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getReleaseByVersion(version string) (*store.Release, error) {
	if len(version) > 0 {
		if version[0:1] != "v" {
			version = fmt.Sprintf("v%s", version)
		}
	}
	v, err := inst.DB.GetReleaseByVersion(version)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, errors.New(fmt.Sprintf("filed to find release by version: %s", version))
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
	return nil, errors.New(fmt.Sprintf("failed to find app by name: %s", appName))
}

func (inst *App) AddRelease(token, version string) *store.Release {
	out, err := inst.addRelease(token, version)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error add release: %s", err.Error()))
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
