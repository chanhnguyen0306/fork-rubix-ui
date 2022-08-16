package main

import (
	"errors"
	"fmt"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"gopkg.in/yaml.v3"
	"os"
)

// edgeReplaceConfig
// file needs to first be uploaded to /data/store
// delete existing file
// upload the new file (use assist file upload)
// restart the service
// deleteFileFromAssist delete the file that was uploaded after the upload to the edge device is completed
func (inst *App) edgeReplaceConfig(connUUID, hostUUID string, body *appstore.EdgeReplaceConfig) (*appstore.EdgeReplaceConfigResp, error) {
	appName := body.AppName
	if appName == "" {
		return nil, errors.New("app name can not be empty")
	}
	if body.FileName == "" {
		body.FileName = "config.yml"
	}
	fileName := body.FileName
	configPath := fmt.Sprintf("%s/%s", inst.store.GetUserConfig(), appName)
	filePath := fmt.Sprintf("%s/%s/%s", inst.store.GetUserConfig(), appName, fileName)
	found := fileutils.New().FileExists(filePath)
	if !found {
		return nil, errors.New(fmt.Sprintf("%s", filePath))
	}
	_, err := inst.assistUploadFile(connUUID, assistStorePath(), configPath, fileName)
	if err != nil {
		return nil, err
	}
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	if appName == "" {
		return nil, errors.New("assist-config-file: app name, cant not be empty")
	}
	if fileName == "" {
		return nil, errors.New("assist-config-file: file name, cant not be empty, try config.yml, config.json or .env")
	}
	return client.EdgeReplaceConfig(hostUUID, body)
}

type ConfigBACnetServer struct {
	ServerName string `yaml:"server_name"`
	DeviceId   int    `yaml:"device_id"`
	Iface      string `yaml:"iface"`
	BiMax      int    `yaml:"bi_max"`
	BoMax      int    `yaml:"bo_max"`
	BvMax      int    `yaml:"bv_max"`
	AiMax      int    `yaml:"ai_max"`
	AoMax      int    `yaml:"ao_max"`
	AvMax      int    `yaml:"av_max"`
	Mqtt       struct {
		BrokerIp   string `yaml:"broker_ip"`
		BrokerPort int    `yaml:"broker_port"`
		Debug      bool   `yaml:"debug"`
	} `yaml:"mqtt"`
}

func (inst *App) ConfigBACnetServer(body *ConfigBACnetServer) error {

	if body.ServerName == "" {
		body.ServerName = "Nube IO"
	}

	if body.Iface == "" {
		body.Iface = "eth0"
	}

	if body.DeviceId == 0 {
		body.DeviceId = 2508
	}

	if body.Mqtt.BrokerIp == "" {
		body.Mqtt.BrokerIp = "0.0.0.0"
	}

	if body.Mqtt.BrokerPort == 0 {
		body.Mqtt.BrokerPort = 1883
	}

	yamlData, err := yaml.Marshal(&body)
	if err != nil {
		fmt.Printf("Error while Marshaling. %v", err)
	}
	appName := "bacnet-server-driver"
	err = inst.store.MakeAppConfig(appName)
	if err != nil {
		return err
	}

	pathName := fmt.Sprintf("%s/%s/%s", inst.store.GetUserConfig(), appName, "config.yml")

	err = fileutils.New().WriteFile(pathName, string(yamlData), os.FileMode(store.FilePerm))
	if err != nil {
		return err
	}

	fmt.Println(" --- YAML ---")
	fmt.Println(string(yamlData))
	return err
}

func assistStorePath() string {
	return "/data/store"
}
