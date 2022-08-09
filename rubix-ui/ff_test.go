package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_exportPointBulk(t *testing.T) {

	app := NewApp()
	data, err := app.exportPointBulk("cloud", "hos_8DD8915845C0", "points test", "dev_a58dca24bba644b2", []string{"pnt_1b4fc54752f843c9", "pnt_19e1cfcff9784b5e"})
	fmt.Println(err)
	pprint.PrintJOSN(data)

}

func TestApp_importPointBulk(t *testing.T) {

	app := NewApp()
	bulk, err := app.importPointBulk("cloud", "hos_8DD8915845C0", "bac_2C6B38A580B3", "dev_a58dca24bba644b2")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(bulk)

}
