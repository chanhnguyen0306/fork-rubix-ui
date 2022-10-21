package store

import (
	"errors"
	"github.com/NubeIO/git/pkg/git"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"os"
	"path"
)

const root = 0755

var FilePerm = root
var gitClient *git.Client

type InstallResponse struct {
	AppName    string
	AppVersion string
	Plugins    []string
}

type Store struct {
	Perm              int    `json:"file_perm"`
	UserPath          string `json:"user_path"`            // ~/rubix
	UserStorePath     string `json:"user_store_path"`      // ~/rubix/store
	UserStoreAppsPath string `json:"user_store_apps_path"` // ~/rubix/store/apps
	UserPluginPath    string `json:"user_plugin_path"`     // ~/rubix/store/plugins
	UserTmpPath       string `json:"user_tmp_path"`        // ~/rubix/tmp
	Owner             string `json:"owner"`                // NubeIO
	BackupsDir        string `json:"backups_dir"`          // ~/backups
}

type AppStore struct {
	Store *Store
	App   *installer.App
}

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

func New(store *Store, app *installer.App) (*AppStore, error) {
	homeDir, _ := fileutils.HomeDir()
	if store == nil {
		return nil, errors.New("store can not be empty")
	}
	if store.Perm == 0 {
		store.Perm = FilePerm
	}
	if store.UserPath == "" {
		store.UserPath = path.Join(homeDir, "rubix")
	}
	if store.UserStorePath == "" {
		store.UserStorePath = path.Join(store.UserPath, "store")
	}
	if store.UserStoreAppsPath == "" {
		store.UserStoreAppsPath = path.Join(store.UserStorePath, "apps")
	}
	if store.UserPluginPath == "" {
		store.UserPluginPath = path.Join(store.UserStorePath, "plugins")
	}
	if store.UserTmpPath == "" {
		store.UserTmpPath = path.Join(store.UserStorePath, "tmp")
	}
	if store.Owner == "" {
		store.Owner = "NubeIO"
	}
	if store.BackupsDir == "" {
		store.BackupsDir = path.Join(store.UserPath, "backups")
	}
	err := store.initMakeAllDirs()
	if err != nil {
		return nil, err
	}
	return &AppStore{Store: store, App: app}, nil
}

func (inst *Store) initMakeAllDirs() error {
	if err := os.MkdirAll(inst.UserPath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.UserStorePath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.UserStoreAppsPath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.UserStoreAppsPath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.UserPluginPath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.UserTmpPath, os.FileMode(FilePerm)); err != nil {
		return err
	}
	if err := os.MkdirAll(inst.BackupsDir, os.FileMode(FilePerm)); err != nil {
		return err
	}
	return nil
}
