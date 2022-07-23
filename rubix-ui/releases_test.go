package main

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

var token = "Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA=="

func TestApp_AddRelease(t *testing.T) {
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)

	path := "flow/v0.6.1.json"
	app := NewApp()
	release, err := app.addRelease(token, path)
	if err != nil {
		return
	}
	fmt.Println(release)
}

func TestApp_downloadAll(t *testing.T) {
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	_, err := app.downloadAll(token, "v0.6.1", "")
	fmt.Println(err)
	if err != nil {
		return
	}
}

func TestApp_assistUpload(t *testing.T) {
	app := NewApp()
	store, err := app.assistUploadApp("cloud", "flow-framework", "v0.6.1")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)

}

func TestApp_assistListStore(t *testing.T) {
	app := NewApp()
	store, err := app.assistListStore("cloud")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)

}
