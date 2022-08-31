package main

import (
	"errors"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	log "github.com/sirupsen/logrus"
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
		ConfigType:   configEnv,
	}
	return client.EdgeWriteConfigYml(hostUUID, writeConfig)
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
	BrokerIp   string `json:"broker_ip"  yaml:"broker_ip"`
	BrokerPort int    `json:"broker_port"  yaml:"broker_port"`
	Debug      bool   `json:"debug" yaml:"debug"`
	Enable     bool   `json:"enable" yaml:"enable"`
}

type bacnetBroker struct {
	BrokerIp   string `json:"broker_ip"  yaml:"broker_ip"`
	BrokerPort int    `json:"broker_port"  yaml:"broker_port"`
	Debug      bool   `json:"debug" yaml:"debug"`
	Enable     bool   `json:"enable" yaml:"enable"`
}

type configBACnetServer struct {
	ServerName   string       `json:"server_name" yaml:"server_name"`
	DeviceId     int          `json:"device_id" yaml:"device_id"`
	Port         int          `json:"port" yaml:"port"`
	Iface        string       `json:"iface" yaml:"iface"`
	BiMax        int          `json:"bi_max" yaml:"bi_max"`
	BoMax        int          `json:"bo_max" yaml:"bo_max"`
	BvMax        int          `json:"bv_max" yaml:"bv_max"`
	AiMax        int          `json:"ai_max" yaml:"ai_max"`
	AoMax        int          `json:"ao_max" yaml:"ao_max"`
	AvMax        int          `json:"av_max" yaml:"av_max"`
	BacnetBroker bacnetBroker `json:"mqtt" yaml:"mqtt"`
}

func (inst *App) edgeWriteBACnetConfig(connUUID, hostUUID string, config *ConfigBACnetServer) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, errors.New("bacnet config cant not be empty")
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

	log.Infof("write bacnet config device-name:%s device-id:%d", config.ServerName, config.DeviceId)

	bacnetConfig := &configBACnetServer{
		ServerName: config.ServerName,
		DeviceId:   config.DeviceId,
		Port:       config.Port,
		Iface:      config.Iface,
		BiMax:      config.BiMax,
		BoMax:      config.BoMax,
		BvMax:      config.BvMax,
		AiMax:      config.AiMax,
		AoMax:      config.AoMax,
		AvMax:      config.AvMax,
		BacnetBroker: bacnetBroker{
			BrokerIp:   config.BrokerIp,
			BrokerPort: config.BrokerPort,
			Debug:      config.Debug,
			Enable:     config.Enable,
		},
	}

	_, err = yaml.Marshal(&bacnetConfig)
	if err != nil {
		return nil, err
	}
	writeConfig := &appstore.EdgeConfig{
		AppName:    bacnetServerDriver,
		Body:       bacnetConfig,
		ConfigType: configYml,
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

func (inst *App) edgeReadBACnetConfig(connUUID, hostUUID string) (*ConfigBACnetServer, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeReadConfig(hostUUID, bacnetServerDriver, configYml)
	if err != nil {
		return nil, err
	}
	data := &ConfigBACnetServer{}
	err = yaml.Unmarshal(resp.Data, &data)
	return data, err
}

func (inst *App) writeAppConfig(connUUID, hostUUID, appName string) error {
	if appName == bacnetServerDriver {
		bacnetConfig, err := inst.edgeReadBACnetConfig(connUUID, hostUUID)
		if err != nil {
			return err
		}
		if bacnetConfig != nil {
			log.Infof("read bacnet config device-name:%s device-id:%d", bacnetConfig.ServerName, bacnetConfig.DeviceId)
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
