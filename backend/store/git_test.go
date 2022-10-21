package store

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"testing"
)

func TestStore_Git(t *testing.T) {
	appName := "flow-framework"
	appVersion := "v0.6.0"
	releaseVersion := "v0.6.8"

	appStore, err := New(&Store{}, installer.New(&installer.App{}))
	fmt.Println(err)
	fmt.Println(appStore)
	app := App{
		Name:           appName,
		Version:        appVersion,
		ReleaseVersion: releaseVersion,
	}
	err = appStore.AddApp(&app)
	fmt.Println(err)
	fmt.Println(app)

	store, err := appStore.ListStore()
	if err != nil {
		return
	}
	fmt.Println(err)
	fmt.Println(store)

	token := decodeToken("Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA==")
	fmt.Printf("%q\n", token)

	releases, err := appStore.GitListReleases(token)
	if err != nil {
		return
	}

	fmt.Println(releases)
}
