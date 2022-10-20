package backend

import (
	"github.com/NubeIO/rubix-ui/backend/constants"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeDeviceInfoAndApps(t *testing.T) {
	app := NewApp()
	resp := app.EdgeDeviceInfoAndApps(connection, "rc", releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeInstallAppFlow(t *testing.T) {
	app := NewApp()
	resp := app.EdgeInstallApp(connection, "rc", constants.flowFramework, releaseVersion, releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeInstallApp(t *testing.T) {
	app := NewApp()
	resp := app.EdgeInstallApp(connection, "rc", appName, appVersion, releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeInstallAppBacnet(t *testing.T) {
	app := NewApp()
	resp := app.EdgeInstallApp(connection, "rc", constants.bacnetServerDriver, "v0.0.16", releaseVersion)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeUnInstallApp(t *testing.T) {
	app := NewApp()
	resp := app.EdgeUnInstallApp(connection, "rc", appName)
	pprint.PrintJOSN(resp)
}
