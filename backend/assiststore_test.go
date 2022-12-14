package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"github.com/NubeIO/rubix-ui/backend/store"
	"testing"
)

func TestApp_assistAddUpload(t *testing.T) { // upload an app to assist
	app := MockNewApp()
	assistClient, err := app.getAssistClient(&AssistClient{ConnUUID: connection})
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	_app := store.App{
		Name:    appName,
		Version: appVersion,
		Arch:    arch,
	}
	_store, skip, err := app.assistAddUploadApp(assistClient, _app, false)
	fmt.Println(err)
	fmt.Println(skip)
	if err != nil {
		return
	}
	pprint.PrintJOSN(_store)
}
