package store

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-files/fileutils"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/lib-uuid/uuid"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strings"
)

type App struct {
	Name           string `json:"name"`    // rubix-wires
	Version        string `json:"version"` // v1.1.1
	Repo           string `json:"repo"`    // wires-builds
	Arch           string `json:"arch"`
	ReleaseVersion string `json:"release_version"`
}

func (inst *AppStore) AddApp(app *App) error {
	if err := os.MkdirAll(inst.GetAppStoreAppPath(app.Name, app.Arch, app.Version), os.FileMode(FilePerm)); err != nil {
		return err
	}
	return nil
}

func (inst *AppStore) ListStore() ([]App, error) {
	rootDir := inst.Store.UserStorePath
	var files []App
	app := App{}
	err := filepath.WalkDir(rootDir, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() && strings.Count(p, string(os.PathSeparator)) == 5 {
			parts := strings.Split(p, "/")
			if len(parts) >= 4 { // app name
				app.Name = parts[4]
			}
			if len(parts) >= 5 { // version
				app.Version = parts[5]
			}
			files = append(files, app)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return files, nil
}

// StoreCheckAppExists  => /user/rubix/store/apps/flow-framework
func (inst *AppStore) StoreCheckAppExists(appName string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	p := path.Join(inst.Store.UserStoreAppsPath, appName)
	found := fileutils.DirExists(p)
	if !found {
		return errors.New(fmt.Sprintf("failed to find app: %s in app-store", appName))
	}
	return nil
}

// StoreCheckAppAndVersionExists  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *AppStore) StoreCheckAppAndVersionExists(appName, arch, version string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	if err := installer.CheckVersion(version); err != nil {
		return err
	}
	p := inst.GetAppStoreAppPath(appName, arch, version)
	found := fileutils.DirExists(p)
	if !found {
		return errors.New(fmt.Sprintf("failed to find app: %s version: %s in app-store", appName, version))
	}
	return nil
}

// MakeUserPathTmpDir  => ~/rubix/tmp/tmp_45DF323E
func (inst *AppStore) MakeUserPathTmpDir() (string, error) {
	dir := uuid.ShortUUID("tmp")
	p := path.Join(inst.Store.UserTmpPath, "tmp", dir)
	return p, os.MkdirAll(p, os.FileMode(FilePerm))
}
