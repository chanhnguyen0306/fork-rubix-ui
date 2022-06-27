package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestNewApp(t *testing.T) {
	app := NewApp()
	data := app.WiresFileUpload("cloud", "rc", "wires-example.json")
	fmt.Println(data)
	//back := app.WiresBackup("cloud", "rc")

	backup := app.WiresBackupSave("cloud", "rc")
	//
	pprint.PrintJOSN(backup)

	//file, err := files.New().WriteBackupFile(back, "test.json")
	//fmt.Println(err)
	//if err != nil {
	//	return
	//}
	//fmt.Println(err)
	//fmt.Println(file)
}
