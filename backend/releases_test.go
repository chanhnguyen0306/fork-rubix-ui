package backend

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/rubix-ui/backend/constants"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

var connection = "cloud"
var token = "Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA=="
var releaseVersion = "v0.6.6"
var appName = constants.rubixWires // flow-framework rubix-wires
var appVersion = "v2.7.4"          // v2.7.4
var product = "Server"
var arch = "amd64"

func TestApp_ListReleases(t *testing.T) { // downloads from GitHub and stores in local json DB
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	release, err := app.gitListReleases(token)
	if err != nil {
		return
	}
	pprint.PrintJOSN(release)
}

func TestApp_AddRelease(t *testing.T) { // downloads from GitHub and stores in local json DB
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	path := "flow/v0.6.8.json"
	app := NewApp()
	release, err := app.addRelease(token, path)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(release)
}

func TestApp_downloadAppAndPlugin(t *testing.T) { // will save all apps from the version
	token := git.DecodeToken(token)
	fmt.Printf("%q\n", token)
	app := NewApp()
	downloaded := app.StoreDownloadApp(token, constants.flowFramework, "v0.6.6", "amd64", false)
	pprint.PrintJOSN(downloaded)
}

func TestApp_getLatestRelease(t *testing.T) {
	release, err := NewApp().getLatestRelease()
	fmt.Println(release)
	fmt.Println(err)
	if err != nil {
		return
	}
}

func TestApp_gitDownloadAllRelease(t *testing.T) { // downloads from GitHub and stores in local json DB
	app := NewApp()
	err := app.GitDownloadAllRelease(true)
	fmt.Println(err)
	if err != nil {
		return
	}

}

func TestApp_getReleases(t *testing.T) { // downloads from GitHub and stores in local json DB

	app := NewApp()
	resp, err := app.getReleases()
	for _, release := range resp {
		pprint.Print(release)
		// pprint.PrintJOSN(release)
	}

	fmt.Println(err)

}

func TestApp_dropReleases(t *testing.T) { // downloads from GitHub and stores in local json DB

	app := NewApp()
	err := app.dropReleases()
	if err != nil {
		return
	}
}
