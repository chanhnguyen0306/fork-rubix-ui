package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_getInternetIP(t *testing.T) {
	app := MockNewApp()
	ips, err := app.getInternetIP()
	fmt.Println(err)
	pprint.PrintJOSN(ips)
}

func TestApp_Scanner(*testing.T) {
	app := MockNewApp()
	ips := app.Scanner("", "", 254, nil)

	pprint.PrintJOSN(ips)
}
