package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/store"
	"strings"
)

func (inst *App) GitListReleases(token string) []store.ReleaseList {
	out, err := inst.appStore.GitListReleases(token)
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

// gitDownloadRelease gets the releases from repo https://github.com/NubeIO/releases/tree/master/flow
func (inst *App) gitDownloadRelease(token, path string) (*store.Release, error) {
	if !strings.Contains(path, "flow/") {
		path = fmt.Sprintf("flow/%s.json", path)
	}
	return inst.appStore.GitDownloadRelease(token, path)
}
