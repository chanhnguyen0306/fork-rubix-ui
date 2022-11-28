package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_assistAddUpload(t *testing.T) { // upload an app to assist
	app := MockNewApp()
	assistClient, err := app.getAssistClient(&AssistClient{ConnUUID: connection})
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	store, skip, err := app.assistAddUploadApp(assistClient, appName, appVersion, arch, false)
	fmt.Println(err)
	fmt.Println(skip)
	if err != nil {
		return
	}
	pprint.PrintJOSN(store)
}
