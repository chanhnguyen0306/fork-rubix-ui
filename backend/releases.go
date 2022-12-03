package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/store"
	"github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
	"sort"
)

func (inst *App) GetReleases() []store.Release {
	out, err := inst.DB.GetReleases()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error get releases: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) GetRelease(uuid string) *store.Release {
	out, err := inst.DB.GetRelease(uuid)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error get release: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) getLatestReleaseVersion() (string, error) {
	err := inst.GitDownloadAllReleases()
	if err != nil {
		log.Warning(err)
	}
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

func (inst *App) addRelease(token, version string) (*store.Release, error) {
	release, err := inst.gitDownloadRelease(token, version)
	if err != nil {
		return nil, err
	}
	return inst.DB.AddRelease(release)
}

func (inst *App) GitDownloadAllReleases() error { // This doesn't need to be public for wires-ui frontend
	gitToken, err := inst.GetGitToken(constants.SettingUUID, false)
	if err != nil {
		return err
	}
	releases, err := inst.appStore.GitListReleases(gitToken)
	if err != nil {
		return err
	}
	for _, release := range releases {
		downloadRelease, err := inst.addRelease(gitToken, release.Path)
		if err != nil {
			log.Infof("Git downloaded error: %s", err.Error())
			return err
		}
		log.Infof("Git downloaded release: %s path: %s name: %s", downloadRelease.Release, release.Path, release.Name)
	}
	return nil
}
