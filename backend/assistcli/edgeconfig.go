package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"gopkg.in/yaml.v3"
)

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

// EdgeWriteConfig replace the config file of a nube app
func (inst *Client) EdgeWriteConfig(hostIDName, appName string) (*Message, error) {
	pushConfig := false
	var writeConfig assistmodel.EdgeConfig
	if appName == constants.BacnetServerDriver {
		pushConfig = true
		resp, connectionErr, requestErr := inst.EdgeReadConfig(hostIDName, appName, constants.ConfigYml)
		var config ConfigBACnetServer
		if connectionErr != nil {
			return nil, connectionErr
		}
		if requestErr != nil {
			config = ConfigBACnetServer{}
		}
		err := yaml.Unmarshal(resp.Data, &config)
		if err != nil {
			return nil, err
		}
		writeConfig = assistmodel.EdgeConfig{
			AppName:    constants.BacnetServerDriver,
			Body:       inst.defaultWrapperBACnetConfig(config),
			ConfigName: constants.ConfigYml,
		}
	}
	if appName == constants.RubixWires {
		pushConfig = true
		config := `
PORT=1313
SECRET_KEY=__SECRET_KEY__
`
		writeConfig = assistmodel.EdgeConfig{
			AppName:      constants.RubixWires,
			BodyAsString: config,
			ConfigName:   constants.ConfigEnv,
		}
	}
	if pushConfig {
		url := fmt.Sprintf("/api/edge/config")
		resp, err := nresty.FormatRestyResponse(inst.Rest.R().
			SetHeader("host_uuid", hostIDName).
			SetHeader("host_name", hostIDName).
			SetResult(&Message{}).
			SetBody(writeConfig).
			Post(url))
		if err != nil {
			return nil, err
		}
		return resp.Result().(*Message), nil
	}
	return nil, nil
}

func (inst *Client) EdgeReadConfig(hostIDName, appName, configName string) (*assistmodel.EdgeConfigResponse, error, error) {
	url := fmt.Sprintf("/api/edge/config?app_name=%s&config_name=%s", appName, configName)
	resp, connectionError, requestErr := nresty.FormatRestyV2Response(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&assistmodel.EdgeConfigResponse{}).
		Get(url))
	if connectionError != nil || requestErr != nil {
		return nil, connectionError, requestErr
	}
	return resp.Result().(*assistmodel.EdgeConfigResponse), nil, nil
}

func (inst *Client) defaultWrapperBACnetConfig(config ConfigBACnetServer) ConfigBACnetServer {
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
	return config
}
