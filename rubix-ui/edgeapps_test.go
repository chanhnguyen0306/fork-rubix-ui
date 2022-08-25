package main

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeDeviceInfoAndApps(t *testing.T) {
	app := NewApp()
	resp := app.EdgeDeviceInfoAndApps(connection, "rc", releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeInstallApp(t *testing.T) {
	app := NewApp()
	resp := app.EdgeInstallApp(connection, "rc", appName, appVersion, releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeServices(t *testing.T) {
	app := NewApp()
	resp := app.EdgeServices(connection, "rc")
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeUnInstallApp(t *testing.T) {
	app := NewApp()
	resp := app.EdgeUnInstallApp(connection, "rc", appName)
	pprint.PrintJOSN(resp)
}

func TestApp_edgeAppsInstalledVersions(t *testing.T) {
	app := NewApp()
	resp, _ := app.edgeListApps(connection, "rc")
	pprint.PrintJOSN(resp)
}
