package main

import (
	"github.com/NubeDev/flow-eng/db"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_NodePallet(t *testing.T) {
	app := NewApp()
	resp := app.GetWiresConnections()
	pprint.PrintJOSN(resp)
}

func TestApp_AddWiresConnection(t *testing.T) {
	app := NewApp()
	resp := app.AddWiresConnection(&db.Connection{

		Enabled:                       nil,
		Application:                   "flow",
		Name:                          "test-2",
		Host:                          "0.0.0.0",
		Port:                          1883,
		Authentication:                nil,
		HTTPS:                         nil,
		Username:                      "",
		Password:                      "",
		Email:                         "",
		Token:                         "",
		Keepalive:                     0,
		Qos:                           0,
		Retain:                        nil,
		AttemptReconnectOnUnavailable: nil,
		AttemptReconnectSecs:          0,
		Timeout:                       0,
	})

	pprint.PrintJOSN(resp)
	//*
}
