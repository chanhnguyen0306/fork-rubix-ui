package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

// first generate the config file, then you can upload it

func TestApp_ConfigBACnetServer(t *testing.T) {
	app := NewApp()
	err := app.ConfigBACnetServer(&ConfigBACnetServer{
		ServerName: "aaaaaaa",
		DeviceId:   0,
		Iface:      "",
		BiMax:      0,
		BoMax:      0,
		BvMax:      0,
		AiMax:      0,
		AoMax:      0,
		AvMax:      0,
		Mqtt: struct {
			BrokerIp   string `yaml:"broker_ip"`
			BrokerPort int    `yaml:"broker_port"`
			Debug      bool   `yaml:"debug"`
		}{},
	})
	if err != nil {
		return
	}
}

func TestApp_edgeReplaceConfig(t *testing.T) {
	app := NewApp()
	config, err := app.edgeReplaceConfig(connection, "rc", &appstore.EdgeReplaceConfig{
		AppName:              "bacnet-server-driver",
		FileName:             "config.yml",
		RestartApp:           false,
		DeleteFileFromAssist: false,
	})
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(config)
}
