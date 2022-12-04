package backend

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func Test_EdgeListPlugins(t *testing.T) {
	app := MockNewApp()
	resp := app.EdgeListPlugins("cloud", "rc")
	pprint.PrintJOSN(resp)
}

func Test_EdgeInstallPlugin(t *testing.T) {
	app := MockNewApp()
	resp := app.EdgeInstallPlugin("cloud", "rc", "system")
	pprint.PrintJOSN(resp)
}

func Test_EdgeDeletePlugin(t *testing.T) {
	app := MockNewApp()
	resp := app.EdgeDeletePlugin("cloud", "rc", "system")
	pprint.PrintJOSN(resp)
}
