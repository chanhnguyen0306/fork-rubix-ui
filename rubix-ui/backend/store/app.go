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

func (inst *Store) initMakeAllDirs() error {
	if err := inst.makeUserPath(); err != nil {
		return err
	}
	if err := inst.makeUserStorePath(); err != nil {
		return err
	}
	if err := inst.makeUserPathTmp(); err != nil {
		return err
	}
	if err := inst.makeUserConfig(); err != nil {
		return err
	}
	if err := inst.makeBackupPath(); err != nil {
		return err
	}
	return nil
}

// AddApp make all the app store dirs
func (inst *Store) AddApp(app *App) (*App, error) {
	if app.Name == "" {
		return nil, errors.New("app name can not be empty")
	}
	if app.Version == "" {
		return nil, errors.New("app version can not be empty")
	}
	if app.ReleaseVersion == "" {
		return nil, errors.New("app release_version can not be empty")
	}
	if err := inst.makeUserPath(); err != nil {
		return nil, err
	}
	if err := inst.makeUserStorePath(); err != nil {
		return nil, err
	}
	if err := inst.makeApp(app.Name); err != nil {
		return nil, err
	}
	if err := inst.makeAppStoreAppDir(app.Name, app.Arch, app.Version); err != nil {
		return nil, err
	}
	if app.Name == flow {
		if err := inst.makePluginDirs(app.Name, app.Arch, app.Version); err != nil {
			return nil, err
		}
	}
	return app, nil
}

func (inst *Store) ListStore() ([]App, error) {
	rootDir := inst.getUserStorePath()
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

// StoreCheckAppExists  => /user/rubix/store/apps/flow-framework/
func (inst *Store) StoreCheckAppExists(appName string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	p := path.Join(inst.getUserStorePathApps(), appName)
	found := fileutils.DirExists(p)
	if !found {
		return errors.New(fmt.Sprintf("failed to find app: %s in app-store", appName))
	}
	return nil
}

// StoreCheckAppAndVersionExists  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *Store) StoreCheckAppAndVersionExists(appName, arch, version string) error {
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

// makeUserPath  => /home/user/rubix
func (inst *Store) makeUserPath() error {
	return os.MkdirAll(inst.getUserPath(), os.FileMode(FilePerm))
}

// makeUserStorePath  => /hom/user/rubix/store
func (inst *Store) makeUserStorePath() error {
	return os.MkdirAll(inst.getUserStorePath(), os.FileMode(FilePerm))
}

// makeUserStorePath  => /hom/user/rubix/tmp
func (inst *Store) makeUserPathTmp() error {
	return os.MkdirAll(fmt.Sprintf("%s/tmp", inst.getUserPath()), os.FileMode(FilePerm))
}

// makeUserStorePath  => /hom/user/rubix/tmp
func (inst *Store) makeUserPathTmpDir() (string, error) {
	dir := uuid.ShortUUID("tmp")
	p := path.Join(inst.getUserPath(), "tmp", dir)
	return p, os.MkdirAll(p, os.FileMode(FilePerm))
}

// makeUserStorePath  => /hom/user/rubix/config
func (inst *Store) makeUserConfig() error {
	return os.MkdirAll(fmt.Sprintf("%s/config", inst.getUserPath()), os.FileMode(FilePerm))
}

// MakeAppConfig  => /hom/user/rubix/config/bacnet-server
func (inst *Store) MakeAppConfig(appName string) error {
	return os.MkdirAll(fmt.Sprintf("%s/config/%s", inst.getUserPath(), appName), os.FileMode(FilePerm))
}

// GetUserConfig  => /home/user/rubix/config
func (inst *Store) GetUserConfig() string {
	return fmt.Sprintf("%s/config", inst.getUserPath())
}

// makeUserPath  => /home/user/rubix/backups
func (inst *Store) makeBackupPath() error {
	return os.MkdirAll(inst.BackupsDir, os.FileMode(FilePerm))
}

// MakeApp  => /data/store/apps/flow-framework
func (inst *Store) makeApp(appName string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	p := path.Join(inst.getUserStorePathApps(), appName)
	return os.MkdirAll(p, os.FileMode(FilePerm))
}

// MakeAppVersionDir  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *Store) makeAppStoreAppDir(appName, arch, version string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	if err := installer.CheckVersion(version); err != nil {
		return err
	}
	p := inst.GetAppStoreAppPath(appName, arch, version)
	return os.MkdirAll(p, os.FileMode(FilePerm))
}

// MakeAppVersionDir  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *Store) makePluginDirs(appName, arch, version string) error {
	if appName == "" {
		return errors.New("app_name can not be empty")
	}
	if err := installer.CheckVersion(version); err != nil {
		return err
	}
	p := inst.GetAppStoreAppPluginsPath(appName, arch, version)
	return os.MkdirAll(p, os.FileMode(FilePerm))
}
