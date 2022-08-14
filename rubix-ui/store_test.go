package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_storeListPluginsArm(t *testing.T) {
	app := NewApp()
	plugins, path, err := app.storeListPluginsArm("v0.6.6")
	fmt.Println(path)
	fmt.Println(err)
	pprint.PrintJOSN(plugins)
}

func TestApp_storeGetPluginPath(t *testing.T) {
	app := NewApp()
	body := &appstore.Plugin{
		PluginName: "bacnetserver",
		Arch:       "amd64",
		Version:    "v0.6.6",
	}
	path, _, err := app.storeGetPluginPath(body)
	fmt.Println(path)
	fmt.Println(err)
}

func TestApp_storeGetPlugin(t *testing.T) {
	app := NewApp()
	body := &appstore.Plugin{
		PluginName: "bacnetserver",
		Arch:       "amd64",
		Version:    "v0.6.6",
	}
	f, flowPlugin, err := app.storeGetPlugin(body)
	if err != nil {
		fmt.Println(err)
		return
	}
	pprint.PrintJOSN(flowPlugin)
	fmt.Println(11111, f.Name())
	fmt.Println(err)

}
