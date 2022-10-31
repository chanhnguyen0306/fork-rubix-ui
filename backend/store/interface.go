package store

import (
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/lib-rubix-installer/installer"
)

type IAppStore interface {
	AddApp(app *App) error
	ListStore() ([]App, error)
	StoreCheckAppExists(appName string) error
	StoreCheckAppAndVersionExists(appName, arch, version string) error
	MakeUserPathTmpDir() (string, error)
	SaveBackup(fileName string, data interface{}) error
	GenerateDownloadOptions(repo string, doNotValidateArch bool) git.DownloadOptions
	DownloadAll(token string, cleanDownload bool, release *Release) ([]App, error)
	DownloadFlowPlugin(token, version, pluginName, arch, releaseVersion string, cleanDownload bool) (*App, error)
	GitDownloadZip(token, appName, version, repo, arch, releaseVersion string, isZipball, cleanDownload bool, gitOptions git.DownloadOptions) (*App, error)
	GetAppStoreAppPath(appName, arch, version string) string
	GitDownloadZipball(repo, version, arch, token string, gitOptions git.DownloadOptions) error
	GitDownloadAsset(repo, version, arch, token string, gitOptions git.DownloadOptions) error
	GitListReleases(token string) ([]ReleaseList, error)
	StoreListPlugins() ([]installer.BuildDetails, string, error)
	DownLoadReleases(token, path string) (*Release, error)
}
