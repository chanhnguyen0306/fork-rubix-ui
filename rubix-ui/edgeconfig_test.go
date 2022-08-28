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
	resp, err := app.edgeReadConfig("cloud", "rc", rubixWires, ".env")
	fmt.Println(err)
	if err != nil {
		return
	}
	fmt.Println(string(resp.Data))
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
	resp, err := app.edgeReadConfig("cloud", "rc", bacnetServerDriver, "config.yml")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(resp)
	data := ConfigBACnetServer{}
	err = yaml.Unmarshal(resp.Data, &data)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(data)
}
