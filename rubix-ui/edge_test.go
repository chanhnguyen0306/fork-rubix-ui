package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_edgeProductInfo(t *testing.T) {
	app := NewApp()
	store, err := app.edgeProductInfo(connection, "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_edgeListApps(t *testing.T) {
	app := NewApp()
	store, err := app.edgeListApps(connection, "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_edgeListAppsAndService(t *testing.T) {
	app := NewApp()
	store, err := app.edgeListAppsAndService(connection, "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_edgeListNubeServices(t *testing.T) {
	app := NewApp()
	store, err := app.edgeListNubeServices(connection, "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_appInstallAppOnEdge(t *testing.T) {
	app := NewApp()
	app.appInstallAppOnEdge(connection, "rc", &EdgeAppInstall{
		ReleaseVersion: "v0.6.1",
		AppName:        appName,
		AppVersion:     appVersion,
		Arch:           arch,
	})
}
