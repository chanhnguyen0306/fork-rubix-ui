package store

import (
	"fmt"
)

func (inst *Store) getUserPath() string {
	return inst.UserPath
}

func (inst *Store) getUserStorePath() string {
	return inst.UserStorePath
}

func (inst *Store) getUserStorePathApps() string {
	return inst.UserStoreAppsPath
}

// GetAppPathAndVersion get the full app install path and version => /home/user/rubix/store/apps/rubix-wires/v0.0.1
func (inst *Store) GetAppPathAndVersion(appName, version string) string {
	return inst.getAppPathAndVersion(appName, version)
}

// getAppPathAndVersion get the full app install path and version => /home/user/rubix/store/apps/rubix-wires/v0.0.1
func (inst *Store) getAppPathAndVersion(appName, version string) string {
	return filePath(fmt.Sprintf("%s/%s/%s", inst.getUserStorePathApps(), appName, version))
}
