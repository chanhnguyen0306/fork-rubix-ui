package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"gopkg.in/yaml.v3"
	"testing"
)

func TestApp_edgeWriteWiresConfig(t *testing.T) {
	app := NewApp()
	resp, err := app.edgeWriteWiresConfig("cloud", "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	fmt.Println(resp)
}

func TestApp_edgeReadConfigWires(t *testing.T) {
	app := NewApp()
	resp, connectionError, requestError := app.edgeReadConfig("cloud", "rc", rubixWires, ".env")
	fmt.Println("connectionError", connectionError)
	fmt.Println("requestError", requestError)
	if connectionError != nil && requestError != nil {
		fmt.Println(string(resp.Data))
	}
}

func TestApp_edgeWriteBACnetConfig(t *testing.T) {
	app := NewApp()
	resp, err := app.edgeWriteBACnetConfig("cloud", "rc", &ConfigBACnetServer{})
	fmt.Println(err)
	if err != nil {
		return
	}
	fmt.Println(resp)
}

func TestApp_edgeReadConfig(t *testing.T) {
	app := NewApp()
	resp, connectionError, requestError := app.edgeReadConfig("cloud", "rc", bacnetServerDriver, "config.yml")
	fmt.Println("connectionError", connectionError)
	fmt.Println("requestError", requestError)
	if connectionError != nil && requestError != nil {
		pprint.PrintJOSN(resp)
		data := ConfigBACnetServer{}
		err := yaml.Unmarshal(resp.Data, &data)
		fmt.Println(err)
		if err != nil {
			return
		}
		pprint.PrintJOSN(data)
	}

}
func TestApp_edgeReadBACnetConfig(t *testing.T) {
	app := NewApp()
	resp, err := app.edgeReadBACnetConfig("cloud", "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(resp)
}
