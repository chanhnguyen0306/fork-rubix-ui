package store

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-files/fileutils"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"path"
)

type App struct {
	Name           string `json:"name"`    // rubix-wires
	Version        string `json:"version"` // v1.1.1
	Repo           string `json:"repo"`    // wires-builds
	Arch           string `json:"arch"`
	ReleaseVersion string `json:"release_version"`
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
