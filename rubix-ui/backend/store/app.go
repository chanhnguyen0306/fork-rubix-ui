package store

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type App struct {
	Name    string `json:"name"`    // rubix-wires
	Version string `json:"version"` // v1.1.1
	Repo    string `json:"repo"`    // wires-builds
}

// AddApp make all the app store dirs
func (inst *Store) AddApp(app *App) (*App, error) {
	appName := app.Name
	version := app.Version
	if appName == "" {
		return nil, errors.New("app name can not be empty")
	}
	if version == "" {
		return nil, errors.New("app version can not be empty")
	}
	if err := inst.makeUserPath(); err != nil {
		return nil, err
	}
	if err := inst.makeUserStorePath(); err != nil {
		return nil, err
	}
	if err := inst.makeApp(appName); err != nil {
		return nil, err
	}
	if err := inst.makeAppVersionDir(appName, version); err != nil {
		return nil, err
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

//makeUserPath  => /hom/user/rubix
func (inst *Store) makeUserPath() error {
	return inst.App.MakeDirectoryIfNotExists(inst.getUserPath(), os.FileMode(FilePerm))
}

//makeUserStorePath  => /hom/user/rubix/store
func (inst *Store) makeUserStorePath() error {
	return inst.App.MakeDirectoryIfNotExists(inst.getUserStorePath(), os.FileMode(FilePerm))
}

//MakeApp  => /data/store/apps/flow-framework
func (inst *Store) makeApp(appName string) error {
	if err := emptyPath(appName); err != nil {
		return err
	}
	path := fmt.Sprintf("%s/%s", inst.getUserStorePathApps(), appName)
	return inst.App.MakeDirectoryIfNotExists(path, os.FileMode(FilePerm))
}

//MakeAppVersionDir  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *Store) makeAppVersionDir(appName, version string) error {
	if err := emptyPath(appName); err != nil {
		return err
	}
	if err := checkVersion(version); err != nil {
		return err
	}
	path := fmt.Sprintf("%s/%s/%s", inst.getUserStorePathApps(), appName, version)
	return inst.App.MakeDirectoryIfNotExists(path, os.FileMode(FilePerm))
}
