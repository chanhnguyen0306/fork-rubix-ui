package main

import (
	"fmt"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_assistUploadFile(t *testing.T) {
	app := NewApp()
	h, _ := fileutils.HomeDir()
	path := fmt.Sprintf("%s/test", h)
	dest := fmt.Sprintf("/data/store")
	file, err := app.assistUploadFile(connection, dest, path, "test.txt")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(file)
}
