package backend

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetPlugins(t *testing.T) {
	app := MockNewApp()
	resp := app.GetPlugins("cloud", "rc")

	pprint.PrintJOSN(resp)
}
