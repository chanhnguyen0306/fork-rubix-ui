package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_buildNetworkSchema(t *testing.T) {
	app := MockNewApp()
	schema, err := app.buildNetworkSchema("cloud", "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(schema)
}
