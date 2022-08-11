package store

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"testing"
)

func TestStore_Git(t *testing.T) {

	appName := "flow-framework"
	appVersion := "v0.6.0"

	inst := &Store{
		App: &installer.App{
			Name:             "",
			Version:          "",
			DataDir:          "",
			HostDownloadPath: "",
			StoreDir:         "",
			TmpDir:           "",
			UserRubixHome:    "",
			FilePerm:         0,
			ServiceName:      "",
			LibSystemPath:    "",
			EtcSystemPath:    "",
			DefaultTimeout:   0,
			AppsInstallDir:   "",
			AppsDownloadDir:  "",
		},
		Perm:          0,
		UserPath:      "",
		UserStorePath: "",
		Version:       appVersion,
		Owner:         "",
		Repo:          appName,
		Arch:          "armv7",
		ServiceFile:   "",
	}

	appStore, err := New(inst)
	fmt.Println(err)
	fmt.Println(appStore)

	app, err := appStore.AddApp(&App{
		Name:    appName,
		Version: appVersion,
	})
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
