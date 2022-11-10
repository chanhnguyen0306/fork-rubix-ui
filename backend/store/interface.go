package store

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
)

type IAppStore interface {
	GitDownloadZip(token, appName, version, repo, arch, releaseVersion string, doNotValidateArch, isZipball, cleanDownload bool) (*App, error)
	DownloadFlowPlugin(token, version, pluginName, arch, releaseVersion string, cleanDownload bool) (*App, error)
	GitListReleases(token string) ([]ReleaseList, error)
	StoreListPlugins() ([]installer.BuildDetails, string, error)
	DownloadReleases(token, path string) (*Release, error)
	GetRubixEdgeVersions(token string) (*[]string, error)
	GetAppStoreAppPath(appName, arch, version string) string
	SaveBackup(fileName string, data interface{}) error
	StoreCheckAppExists(appName string) error
	StoreCheckAppAndVersionExists(appName, arch, version string) error
}
