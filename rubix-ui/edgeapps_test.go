package main

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeInstallApp(t *testing.T) {
	app := NewApp()
	resp := app.EdgeInstallApp(connection, "rc", appName, appVersion, arch, appVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeServices(t *testing.T) {
	app := NewApp()
	resp := app.EdgeServices(connection, "rc")
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeAppsInstalled(t *testing.T) {
	app := NewApp()
	resp := app.EdgeAppsInstalled(connection, "rc", appVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_edgeAppServices(t *testing.T) {
	app := NewApp()
	resp, _ := app.edgeAppServices(connection, "rc")
	pprint.PrintJOSN(resp)
}
