package main

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetPlugins(t *testing.T) {
	app := NewApp()
	resp := app.GetPlugins("cloud", "rc")

	pprint.PrintJOSN(resp)
}
