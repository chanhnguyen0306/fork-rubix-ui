package main

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/rubix-assist/service/store"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

var connection = "cloud"
var token = "Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA=="
var appName = "flow-framework"
var appVersion = "v0.6.1"

func TestApp_AddRelease(t *testing.T) { //downloads from GitHub and stores in local json DB
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

func TestApp_downloadAll(t *testing.T) { // will save all apps from the version
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	_, err := app.downloadAll(token, "v0.6.1", "")
	fmt.Println(err)
	if err != nil {
		return
	}
}

func TestApp_assistListStore(t *testing.T) { // list all apps on assist
	app := NewApp()
	store, err := app.assistListStore(connection)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_assistAdd(t *testing.T) { // add an app to assist
	app := NewApp()
	store, err := app.assistAddApp(connection, &store.App{
		Name:    appName,
		Version: appVersion,
	})
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_assistUpload(t *testing.T) { // upload an app to assist
	app := NewApp()
	store, err := app.assistUploadApp(connection, appName, appVersion)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}
