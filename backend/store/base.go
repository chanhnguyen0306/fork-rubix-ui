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

type store struct {
	Store *Store
	App   *installer.App
}

type InterfaceStore interface {
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

func New(_store *Store, app *installer.App) (InterfaceStore, error) {
	homeDir, _ := fileutils.HomeDir()
	if _store == nil {
		return nil, errors.New("store can not be empty")
	}
	if _store.Perm == 0 {
		_store.Perm = FilePerm
	}
	if _store.UserPath == "" {
		_store.UserPath = path.Join(homeDir, "rubix")
	}
	if _store.UserStorePath == "" {
		_store.UserStorePath = path.Join(_store.UserPath, "_store")
	}
	if _store.UserStoreAppsPath == "" {
		_store.UserStoreAppsPath = path.Join(_store.UserStorePath, "apps")
	}
	if _store.UserPluginPath == "" {
		_store.UserPluginPath = path.Join(_store.UserStorePath, "plugins")
	}
	if _store.UserTmpPath == "" {
		_store.UserTmpPath = path.Join(_store.UserStorePath, "tmp")
	}
	if _store.Owner == "" {
		_store.Owner = "NubeIO"
	}
	if _store.BackupsDir == "" {
		_store.BackupsDir = path.Join(_store.UserPath, "backups")
	}
	err := _store.initMakeAllDirs()
	if err != nil {
		return nil, err
	}
	return &store{Store: _store, App: app}, nil
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
