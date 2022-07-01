package main

import (
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetNetworks(t *testing.T) {

	app := NewApp()
	data := app.GetNetworksWithPoints("cloud", "rc")
	pprint.PrintJOSN(data)
	//back := app.WiresBackup("cloud", "rc")
	//pprint.PrintJOSN(back)

	//backup := app.WiresBackupSave("cloud", "rc")
	//
	//pprint.PrintJOSN(backup)

	whois, err := app.BacnetWhois("cloud", "rc")
	if err != nil {
		return
	}
	pprint.PrintJOSN(whois)

}
