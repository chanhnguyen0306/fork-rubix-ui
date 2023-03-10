package store

import "github.com/NubeIO/rubix-ui/backend/helpers/builds"

type IAppStore interface {
	GitListReleases(token string) ([]ReleaseList, error)
	GitDownloadRelease(token, path string) (*Release, error)
	StoreListPlugins() ([]builds.BuildDetails, string, error)
	GitDownloadZip(token string, app App, doNotValidateArch, isZipball bool) (*App, error)
	DownloadFlowPlugin(token string, app App) (*App, error)
	GetAppStoreAppPath(app App) string
	SaveBackup(fileName string, data interface{}) error
	StoreCheckAppAndVersionExists(app App) error
}
