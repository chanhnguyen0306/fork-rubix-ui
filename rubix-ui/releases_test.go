package main

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

var connection = "cloud"
var token = "Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA=="
var appName = "flow-framework"
var appVersion = "v0.6.1"
var product = "Server"
var arch = "amd64"

func TestApp_ListReleases(t *testing.T) { //downloads from GitHub and stores in local json DB
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	release, err := app.gitListReleases(token)
	if err != nil {
		return
	}
	pprint.PrintJOSN(release)
}

func TestApp_AddRelease(t *testing.T) { //downloads from GitHub and stores in local json DB
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	path := "flow/v0.6.1.json"
	app := NewApp()
	release, err := app.addRelease(token, path)
	if err != nil {
		return
	}
	pprint.PrintJOSN(release)
}

func TestApp_downloadAppAndPlugin(t *testing.T) { // will save all apps from the version
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	downloaded := app.StoreDownloadApp(token, "edge-28-driver", "v0.6.1", "armv7", false)
	pprint.PrintJOSN(downloaded)
}

func TestApp_downloadAll(t *testing.T) { // will save all apps from the version
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	_, err := app.downloadAll(token, "v0.6.1", false)
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

func TestApp_assistAddUpload(t *testing.T) { // upload an app to assist
	app := NewApp()
	store, err := app.assistAddUploadApp(connection, appName, appVersion, product, arch)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}
