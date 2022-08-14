package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_assistListStore(t *testing.T) { // list all apps on assist
	app := NewApp()
	store, err := app.assistListStore(connection)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_assistAddUpload(t *testing.T) { // upload an app to assist
	app := NewApp()
	store, err := app.assistAddUploadApp(connection, appName, appVersion, product, arch, false)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_StoreUploadPlugin(t *testing.T) {
	app := NewApp()
	body := &appstore.Plugin{
		PluginName: "bacnetserver",
		Arch:       "amd64",
		Version:    "v0.6.6",
	}
	store := app.StoreUploadPlugin(connection, body)
	pprint.PrintJOSN(store)
}
