package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetNetworks(t *testing.T) {

	app := NewApp()
	data, err := app.exportPointBulk("cloud", "hos_8DD8915845C0", "points test", "dev_a58dca24bba644b2", []string{"pnt_1b4fc54752f843c9", "pnt_19e1cfcff9784b5e"})
	fmt.Println(err)
	pprint.PrintJOSN(data)
	////back := app.WiresBackup("cloud", "rc")
	////pprint.PrintJOSN(back)
	//
	////backup := app.WiresBackupSave("cloud", "rc")
	////
	////pprint.PrintJOSN(backup)
	//
	//whois, err := app.BacnetWhois("cloud", "rc")
	//if err != nil {
	//	return
	//}
	//pprint.PrintJOSN(whois)

}
