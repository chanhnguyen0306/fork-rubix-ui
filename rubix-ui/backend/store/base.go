package store

import (
	"errors"
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
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
	App               *installer.App
	Perm              int    `json:"file_perm"`
	UserPath          string `json:"user_path"`
	UserStorePath     string `json:"user_store_path"`
	UserStoreAppsPath string `json:"user_store_apps_path"`
	Version           string `json:"version"` // v1.1.1
	Owner             string `json:"owner"`   // NubeIO
	Repo              string `json:"repo"`
	Arch              string `json:"arch"`
	ServiceFile       string `json:"service_file"`
	BackupsDir        string `json:"backups_dir"`
	assistStore       *appstore.Store
}

func New(store *Store) (*Store, error) {
	homeDir, _ := fileutils.HomeDir()
	if store == nil {
		return nil, errors.New("store can not be empty")
	}
	if store.Arch == "" {
		store.Arch = "armv7"
	}
	if store.App == nil {
		store.App = &installer.App{}
	}
	if store.Owner == "" {
		store.Owner = "NubeIO"
	}
	if store.Repo == "" {
		store.Repo = "releases"
	}
	if store.Version == "" {
		store.Version = "latest"
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
	if store.Perm == 0 {
		store.Perm = FilePerm
	}
	if store.App.DataDir == "" {
		store.App.DataDir = "/data"
	}
	if store.BackupsDir == "" {
		store.BackupsDir = path.Join(store.UserPath, "backups")
	}
	store.App = installer.New(store.App)
	appStore, err := appstore.New(&appstore.Store{
		App: &installer.App{},
	})
	if err != nil {
		return nil, errors.New(fmt.Sprintf("init assit-store err: %s", err.Error()))
	}
	store.assistStore = appStore
	err = store.initMakeAllDirs()
	if err != nil {
		return nil, err
	}

	return store, nil
}
