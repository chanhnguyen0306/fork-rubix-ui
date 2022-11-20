package backend

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_EdgeGetNetworks(t *testing.T) {
	app := MockNewApp()
	resp := app.EdgeGetNetworks("cloud", "rc")
	pprint.PrintJOSN(resp)
}
