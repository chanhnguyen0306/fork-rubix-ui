package store

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"testing"
)

func TestStore_UnPackWires(t *testing.T) {

	appName := "rubix-wries"
	appVersion := "v2.7.4"

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

	err = appStore.UnPackWires(appVersion)
	fmt.Println(err)
	if err != nil {
		return
	}

}
