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

func TestApp_EditIP(t *testing.T) {
	app := MockNewApp()
	app.RcSetNetworks("cloud", "rc", &RcNetworkBody{
		Eth0IpSettings: "11111",
		Eth0Interface:  "",
		Eth0Ip:         "",
		Eth0Netmask:    "",
		Eth0Gateway:    "",
		Eth1IpSettings: "",
		Eth1Interface:  "",
		Eth1Ip:         "",
		Eth1Netmask:    "",
		Eth1Gateway:    "",
	})

}
