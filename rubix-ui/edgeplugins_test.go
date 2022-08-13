package main

import (
	"github.com/NubeIO/rubix-assist/service/appstore"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeUploadPlugin(t *testing.T) {
	app := NewApp()
	body := &appstore.Plugin{
		PluginName: "bacnetserver",
		Arch:       "amd64",
		Version:    "v0.6.6",
	}
	resp := app.EdgeUploadPlugin(connection, "rc", body)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeListPlugins(t *testing.T) {
	app := NewApp()
	resp := app.EdgeListPlugins(connection, "rc")
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeDeletePlugin(t *testing.T) {
	app := NewApp()
	body := &appstore.Plugin{
		PluginName: "bacnetserver",
		Arch:       "amd64",
		Version:    "v0.6.6",
	}
	resp := app.EdgeDeletePlugin(connection, "rc", body)
	pprint.PrintJOSN(resp)
}

func TestApp_EdgeDeleteAllPlugins(t *testing.T) {
	app := NewApp()
	resp := app.EdgeDeleteAllPlugins(connection, "rc")
	pprint.PrintJOSN(resp)
}
