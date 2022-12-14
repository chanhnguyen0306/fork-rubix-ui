package store

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-files/fileutils"
	"github.com/NubeIO/rubix-assist/helpers"
	"io/ioutil"
)

type App struct {
	Name    string `json:"name"`    // rubix-wires
	Version string `json:"version"` // v1.1.1
	Repo    string `json:"repo"`    // wires-builds
	Arch    string `json:"arch"`
}

// StoreCheckAppAndVersionExists  => /user/rubix/store/apps/flow-framework/v1.1.1
func (inst *AppStore) StoreCheckAppAndVersionExists(app App) error {
	if app.Name == "" {
		return errors.New("app name can not be empty")
	}
	if err := helpers.CheckVersion(app.Version); err != nil {
		return err
	}
	p := inst.GetAppStoreAppPath(app)
	found := fileutils.DirExists(p)
	if !found {
		return errors.New(fmt.Sprintf("failed to find app: %s with arch: %s & version: %s in app store",
			app.Name, app.Arch, app.Version))
	}
	files, _ := ioutil.ReadDir(p)
	if len(files) == 0 {
		return errors.New(fmt.Sprintf("failed to find app: %s with arch: %s & version: %s in app store",
			app.Name, app.Arch, app.Version))
	}
	return nil
}
