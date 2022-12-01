package backend

import (
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/hashicorp/go-version"
)

func (inst *App) EdgeRubixAppVersions(connUUID, hostUUID, appName, minVersion, maxVersion string) []string {
	validVersions := make([]string, 0)
	installedVersion, err := inst.getInstalledVersion(connUUID, hostUUID, appName)
	if err != nil {
		return validVersions
	}
	const owner = "NubeIO"
	repo := namings.GetRepoNameFromAppName(appName)
	versions := inst.getRepoVersions(owner, repo)
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
	_installedVersion, err := version.NewVersion(installedVersion)
	if err != nil {
		return validVersions
	}
	for _, v := range versions {
		_v, err := version.NewVersion(v)
		if err != nil {
			continue
		}
		if _v.GreaterThanOrEqual(_minVersion) &&
			_v.LessThanOrEqual(_maxVersion) &&
			_v.GreaterThanOrEqual(_installedVersion) {
			validVersions = append(validVersions, v)
		}
	}
	return validVersions
}

func (inst *App) getInstalledVersion(connUUID, hostUUID, appName string) (string, error) {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return "", err
	}
	appStatus, connectionErr, requestErr := assistClient.EdgeAppStatus(hostUUID, appName)
	if connectionErr != nil {
		inst.uiErrorMessage(connectionErr)
		return "", connectionErr
	}
	if requestErr != nil {
		inst.uiWarningMessage(requestErr)
	}
	if appStatus != nil && appStatus.Version != "" {
		return appStatus.Version, nil
	}
	return "v0.0.0", nil
}
