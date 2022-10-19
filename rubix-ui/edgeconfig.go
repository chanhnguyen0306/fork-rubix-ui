package main

import (
	"errors"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v3"
)

func (inst *App) edgeWriteWiresConfig(connUUID, hostUUID string) (*assitcli.Message, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	config := `
PORT=1313
SECRET_KEY=__SECRET_KEY__
`
	writeConfig := &assistmodel.EdgeConfig{
		AppName:      rubixWires,
		BodyAsString: config,
		ConfigName:   configEnv,
	}
	return client.EdgeWriteConfig(hostUUID, writeConfig)
}

type Mqtt struct {
	BrokerIp   string `json:"broker_ip"  yaml:"broker_ip"`
	BrokerPort int    `json:"broker_port"  yaml:"broker_port"`
	Debug      bool   `json:"debug" yaml:"debug"`
	Enable     bool   `json:"enable" yaml:"enable"`
}

type ConfigBACnetServer struct {
	ServerName string `json:"server_name" yaml:"server_name"`
	DeviceId   int    `json:"device_id" yaml:"device_id"`
	Port       int    `json:"port" yaml:"port"`
	Iface      string `json:"iface" yaml:"iface"`
	BiMax      int    `json:"bi_max" yaml:"bi_max"`
	BoMax      int    `json:"bo_max" yaml:"bo_max"`
	BvMax      int    `json:"bv_max" yaml:"bv_max"`
	AiMax      int    `json:"ai_max" yaml:"ai_max"`
	AoMax      int    `json:"ao_max" yaml:"ao_max"`
	AvMax      int    `json:"av_max" yaml:"av_max"`
	Mqtt       Mqtt   `json:"mqtt" yaml:"mqtt"`
}

func (inst *App) edgeWriteBACnetConfig(connUUID, hostUUID string, config *ConfigBACnetServer) (*assitcli.Message, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, errors.New("bacnet config cant not be empty")
	}
	if config.ServerName == "" {
		config.ServerName = "Nube IO"
	}

	if config.DeviceId == 0 {
		config.DeviceId = 2508
	}
	if config.Iface == "" {
		config.Iface = "eth0"
	}
	if config.BiMax == 0 {
		config.BiMax = 2
	}
	if config.BoMax == 0 {
		config.BoMax = 2
	}
	if config.BvMax == 0 {
		config.BvMax = 2
	}
	if config.AiMax == 0 {
		config.AiMax = 2
	}
	if config.AoMax == 0 {
		config.AoMax = 2
	}
	if config.AvMax == 0 {
		config.AvMax = 2
	}

	log.Infof("write bacnet config device-name: %s device-id: %d", config.ServerName, config.DeviceId)

	_, err = yaml.Marshal(&config)
	if err != nil {
		return nil, err
	}
	writeConfig := &assistmodel.EdgeConfig{
		AppName:    bacnetServerDriver,
		Body:       config,
		ConfigName: configYml,
	}
	return client.EdgeWriteConfig(hostUUID, writeConfig)
}

func (inst *App) edgeReadConfig(connUUID, hostUUID, appName, configName string) (*assistmodel.EdgeConfigResponse, error, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, nil, err
	}
	resp, connectionErr, requestErr := client.EdgeReadConfig(hostUUID, appName, configName)
	return resp, connectionErr, requestErr
}

func (inst *App) edgeReadBACnetConfig(connUUID, hostUUID string) (*ConfigBACnetServer, error) {
	resp, connectionErr, requestErr := inst.edgeReadConfig(connUUID, hostUUID, bacnetServerDriver, configYml)
	if connectionErr != nil {
		return nil, connectionErr
	}
	if requestErr != nil {
		return &ConfigBACnetServer{}, nil
	}
	data := &ConfigBACnetServer{}
	err := yaml.Unmarshal(resp.Data, &data)
	return data, err
}

func (inst *App) writeAppConfig(connUUID, hostUUID, appName string) error {
	if appName == bacnetServerDriver {
		bacnetConfig, err := inst.edgeReadBACnetConfig(connUUID, hostUUID)
		if err != nil {
			return err
		}
		if bacnetConfig != nil {
			log.Infof("read bacnet config device-name: %s device-id: %d", bacnetConfig.ServerName, bacnetConfig.DeviceId)
		}
		_, err = inst.edgeWriteBACnetConfig(connUUID, hostUUID, bacnetConfig)
		if err != nil {
			return err
		}
	}
	if appName == rubixWires {
		_, err := inst.edgeWriteWiresConfig(connUUID, hostUUID)
		if err != nil {
			return err
		}
		log.Infof("wrote bacnet config file")
	}
	return nil
}
