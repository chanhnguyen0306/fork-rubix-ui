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
