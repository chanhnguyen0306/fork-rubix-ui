package store

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestStore_StoreListPlugins(t *testing.T) {

	inst := &Store{
		App: &installer.App{
			Name:    "flow-framework",
			Version: "v0.5.1",
		},
		Perm:          0,
		UserPath:      "",
		UserStorePath: "",
		Version:       "v0.5.1",
		Owner:         "",
		Repo:          "flow-framework",
		Arch:          "armv7",
		ServiceFile:   "",
	}

	appStore, err := New(inst)
	fmt.Println(err)
	if err != nil {
		return
	}
	plugins, path, err := appStore.StoreListPluginsArm("v0.6.")
	fmt.Println(err, path)
	if err != nil {
		return
	}
	pprint.PrintJOSN(plugins)
}
