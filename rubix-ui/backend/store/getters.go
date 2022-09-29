package store

import (
	"path"
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

// GetAppStoreAppPath get the full app install path and version => ~/rubix/store/apps/rubix-wires/<amd64|armv7>/<version>
func (inst *Store) GetAppStoreAppPath(appName, arch, version string) string {
	return path.Join(inst.getUserStorePathApps(), appName, arch, version)
}

// GetAppStoreAppPluginsPath get the full app install path and version => ~/rubix/store/apps/flow-framework/<amd64|armv7>/<version>/plugins
func (inst *Store) GetAppStoreAppPluginsPath(appName, arch, version string) string {
	return path.Join(inst.GetAppStoreAppPath(appName, arch, version), "plugins")
}
