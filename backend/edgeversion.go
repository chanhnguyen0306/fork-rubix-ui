package backend

import (
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/hashicorp/go-version"
)

func (inst *App) EdgeRubixAppVersions(appName, minVersion, maxVersion string) []string {
	const owner = "NubeIO"
	repo := namings.GetRepoNameFromAppName(appName)
	versions := inst.getRepoVersions(owner, repo)
	validVersions := make([]string, 0)
	if minVersion == "" {
		minVersion = "v0.0.0"
	}
	if maxVersion == "" {
		maxVersion = "v1000.0.0"
	}
	_minVersion, err := version.NewVersion(minVersion)
	if err != nil {
		return validVersions
	}
	_maxVersion, err := version.NewVersion(maxVersion)
	if err != nil {
		return validVersions
	}
	for _, v := range versions {
		_v, err := version.NewVersion(v)
		if err != nil {
			continue
		}
		if _v.GreaterThanOrEqual(_minVersion) && _v.LessThanOrEqual(_maxVersion) {
			validVersions = append(validVersions, v)
		}
	}
	return validVersions
}
