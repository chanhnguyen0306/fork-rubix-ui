package main

import (
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"gopkg.in/yaml.v3"
)

func (inst *App) edgeWriteWiresConfig(connUUID, hostUUID string) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	config := `
PORT=1313
SECRET_KEY=__SECRET_KEY__
`
	writeConfig := &appstore.EdgeConfig{
		AppName:      rubixWires,
		BodyAsString: config,
		ConfigType:   ".env",
	}
	return client.EdgeWriteConfigYml(hostUUID, writeConfig)
}

func (inst *App) edgeWriteBACnetConfig(connUUID, hostUUID string, config *ConfigBACnetServer) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	if config.ServerName == "" {
		config.ServerName = "Nube IO"
	}
	if config.Iface == "" {
		config.Iface = "eth0"
	}
	if config.DeviceId == 0 {
		config.DeviceId = 2508
	}
	_, err = yaml.Marshal(&config)
	if err != nil {
		return nil, err
	}
	writeConfig := &appstore.EdgeConfig{
		AppName:    bacnetServerDriver,
		Body:       config,
		ConfigType: "config.yml",
	}
	return client.EdgeWriteConfigYml(hostUUID, writeConfig)

}

func (inst *App) edgeReadConfig(connUUID, hostUUID, appName, configName string) (*appstore.EdgeConfig, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeReadConfig(hostUUID, appName, configName)
	if err != nil {
		return nil, err
	}
	return resp, err
}

type ConfigBACnetServer struct {
	ServerName string `json:"server_name" yaml:"server_name"`
	DeviceId   int    `json:"device_id" yaml:"device_id"`
	Iface      string `json:"iface" yaml:"iface"`
	BiMax      int    `json:"bi_max" yaml:"bi_max"`
	BoMax      int    `json:"bo_max" yaml:"bo_max"`
	BvMax      int    `json:"bv_max" yaml:"bv_max"`
	AiMax      int    `json:"ai_max" yaml:"ai_max"`
	AoMax      int    `json:"ao_max" yaml:"ao_max"`
	AvMax      int    `json:"av_max" yaml:"av_max"`
	BrokerIp   string `json:"broker_ip"  yaml:"broker_ip"`
	BrokerPort int    `json:"broker_port"  yaml:"broker_port"`
	Debug      bool   `json:"debug" yaml:"debug"`
	Enable     bool   `json:"enable" yaml:"enable"`
}
