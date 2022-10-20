package backend

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetNetworkDevices(t *testing.T) {

	app := NewApp()
	resp := app.GetNetworkDevices("cloud", "rc", "net_98b19c63529d44ba")
	pprint.PrintJOSN(resp)

}
