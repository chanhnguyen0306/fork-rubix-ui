package store

import (
	"path"
)

// GetAppStoreAppPath get the full app install path and version => ~/rubix/store/apps/rubix-wires/<amd64|armv7>/<version>
func (inst *Store) GetAppStoreAppPath(appName, arch, version string) string {
	return path.Join(inst.UserStoreAppsPath, appName, arch, version)
}