package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"testing"
	"time"
)

func TestApp_assistLogin(t *testing.T) {
	app := NewApp()
	err := app.assistGenerateToken("cloud", true)
	fmt.Println(err)
}

func TestApp_ffProxy(t *testing.T) {
	app := NewApp()
	app.ffProxy("cloud", "rc")
}

func TestApp_testProxy(t *testing.T) {
	app := NewApp()
	app.testProxy("cloud", "rc")
}

func TestApp_EdgeAddNetwork(t *testing.T) {
	app := NewApp()
	body := &model.Network{
		CommonNameUnique: model.CommonNameUnique{
			Name: "tt",
		},
		CommonFault: model.CommonFault{
			InFault:      false,
			MessageLevel: "",
			MessageCode:  "",
			Message:      "",
			LastOk:       time.Time{},
			LastFail:     time.Time{},
		},
		PluginPath:       "bacnetmaster",
		NetworkInterface: "eth0",
	}
	app.edgeAddNetwork("cloud", "rc", body, true)
}

func TestApp_GetFlowNetwork(t *testing.T) {
	app := NewApp()

	app.GetFlowNetwork("cloud", "rc", "fln_545ef50811ca44d6", true)
}
