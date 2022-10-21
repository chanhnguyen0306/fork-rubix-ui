package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
	"strings"
)

func (inst *App) GitListReleases(token string) []store.ReleaseList {
	out, err := inst.store.GitListReleases(token)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error list releases: %s", err.Error()))
		return []store.ReleaseList{}
	}
	return out
}

func (inst *App) GitDownloadRelease(token, version string) *store.Release {
	out, err := inst.gitDownloadRelease(token, version)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error download release: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) GitDownloadAllRelease(runDownloads bool) error {
	if !runDownloads {
		return nil
	}
	gitToken, err := inst.GetGitToken(constants.SettingUUID, false)
	if err != nil {
		return err
	}
	releases, err := inst.store.GitListReleases(gitToken)
	if err != nil {
		return err
	}
	for _, release := range releases {
		downloadRelease, err := inst.addRelease(gitToken, release.Path)
		if err != nil {
			log.Infof("GIT downloaded error: %s", err.Error())
			return err
		}
		log.Infof("GIT downloaded release: %s path: %s name: %s", downloadRelease.Release, release.Path, release.Name)
	}
	return nil

}

// gitGetRelease gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (inst *App) gitDownloadRelease(token, path string) (*store.Release, error) {
	if !strings.Contains(path, "flow/") {
		path = fmt.Sprintf("flow/%s.json", path)
	}
	return inst.store.DownLoadReleases(token, path)
}
