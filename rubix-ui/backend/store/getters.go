package store

import "fmt"

func (inst *Store) getUserPath() string {
	return inst.UserPath
}

func (inst *Store) getUserStorePath() string {
	return inst.UserStorePath
}

func (inst *Store) getUserStorePathApps() string {
	return inst.UserStoreAppsPath
}

// getAppPathAndVersion get the full app install path and version => /home/user/rubix/store/apps/wires-builds/v0.0.1
func (inst *Store) getAppPathAndVersion(appBuildName, version string) string {
	return filePath(fmt.Sprintf("%s/%s/%s", inst.getUserStorePathApps(), appBuildName, version))
}
