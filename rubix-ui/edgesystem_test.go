package main

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeEdgeCtlAction(t *testing.T) {
	app := NewApp()
	body := &installer.CtlBody{
		AppName:      "",
		Service:      "",
		Action:       "",
		Timeout:      0,
		ServiceNames: nil,
		AppNames:     nil,
	}
	resp := app.EdgeEdgeCtlAction(connection, "rc", body)
	pprint.PrintJOSN(resp)
}
