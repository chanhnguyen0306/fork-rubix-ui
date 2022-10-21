package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_assistListStore(t *testing.T) { // list all apps on assist
	app := MockNewApp()
	store, err := app.assistListStore(connection)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}

func TestApp_assistAddUpload(t *testing.T) { // upload an app to assist
	app := MockNewApp()
	store, err := app.assistAddUploadApp(connection, appName, appVersion, arch, false)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}
