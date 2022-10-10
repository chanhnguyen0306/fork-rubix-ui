package main

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_NodePallet(t *testing.T) {
	app := NewApp()
	resp := app.NodeValues()
	pprint.PrintJOSN(resp)
}
