package store

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"testing"
)

func TestStore_AddApp(t *testing.T) {

	appName := "flow-framework"
	appVersion := "v0.6.0"

	inst := &Store{
		App:           &installer.App{},
		Perm:          0,
		UserPath:      "",
		UserStorePath: "",
		Version:       appVersion,
		Owner:         "",
		Repo:          appName,
		Arch:          "armv7",
		ServiceFile:   "",
	}

	appStore, err := New(inst)
	fmt.Println(err)
	fmt.Println(appStore)

	app, err := appStore.AddApp(&App{
		Name:    appName,
		Version: appVersion,
	})
	fmt.Println(err)
	fmt.Println(app)

}

func TestStore_GetZip(t *testing.T) {

}
