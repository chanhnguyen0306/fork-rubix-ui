package store

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestStore_StoreListPlugins(t *testing.T) {
	inst, _ := New(&Store{})
	appStore, err := New(inst)
	fmt.Println(err)
	if err != nil {
		return
	}
	plugins, path, err := appStore.StoreListPluginsArm("v0.6.8")
	fmt.Println(err, path)
	if err != nil {
		return
	}
	pprint.PrintJOSN(plugins)
}
