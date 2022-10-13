package main

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeEdgeCtlAction(t *testing.T) {
	app := NewApp()
	body := &installer.SystemCtlBody{
		AppName: "flow-framework",
		Action:  "enable",
	}
	resp, _ := app.edgeEdgeCtlAction(connection, "rc", body)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeCtlStatus(t *testing.T) {
	app := NewApp()
	body := &installer.SystemCtlBody{
		AppName: "flow-framework",
	}
	resp := app.EdgeCtlStatus(connection, "rc", body)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeServiceMassStatus(t *testing.T) {
	app := NewApp()
	body := &installer.SystemCtlBody{
		AppNames: []string{"flow-framework"},
		Action:   "isInstalled",
	}
	resp := app.EdgeServiceMassStatus(connection, "rc", body)
	pprint.PrintJOSN(resp)
}
