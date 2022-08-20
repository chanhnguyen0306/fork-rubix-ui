package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/lib-schema/bacnetschema"
	"github.com/NubeIO/lib-schema/edge28schema"
	"github.com/NubeIO/lib-schema/loraschema"
	"github.com/NubeIO/lib-schema/lorawanschema"
	"github.com/NubeIO/lib-schema/masterschema"
	"github.com/NubeIO/lib-schema/modbuschema"
	"github.com/NubeIO/lib-schema/rubixioschema"
	"github.com/NubeIO/lib-schema/schema"
	"github.com/NubeIO/lib-schema/systemschema"
)

const (
	pluginModbus       = "modbus"
	pluginBACnet       = "bacnetserver"
	pluginBACnetMaster = "bacnetmaster"
	pluginLora         = "lora"
	pluginLoraWAN      = "lorawan"
	pluginSystem       = "system"
	pluginEdge28       = "edge28"
	pluginRubixIO      = "rubix-io"
)

func setPluginURL(pluginName, netDevOrPoint string) (string, error) {
	if pluginName == "" {
		return "", errors.New("no plugin name was provided")
	}
	var url string
	switch pluginName {
	case pluginModbus:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginBACnet:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginBACnetMaster:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginLora:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginLoraWAN:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginSystem:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginEdge28:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	case pluginRubixIO:
		url = fmt.Sprintf("/api/plugins/api/%s/schema/json/%s", pluginName, netDevOrPoint)
	}
	if url == "" {
		return "", errors.New(fmt.Sprintf("invaild plugin name was provided:%s", pluginName))
	}
	return url, nil
}

func setPluginSchema(body []byte, inter interface{}) (interface{}, error) {
	err := json.Unmarshal(body, &inter)
	return inter, err
}

func (inst *App) GetFlowNetworkSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	url, err := setPluginURL(pluginName, "network")
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.FFProxyGET(hostUUID, url)
	if err != nil || data.StatusCode() > 299 {
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		}
		return schema.GetDefaults()
	}
	var sch interface{}
	switch pluginName {
	case pluginModbus:
		sch, err = setPluginSchema(data.Body(), &modbuschema.NetworkSchema{})
		return sch
	case pluginBACnet:
		sch, err = setPluginSchema(data.Body(), &bacnetschema.NetworkSchema{})
		return sch
	case pluginBACnetMaster:
		sch, err = setPluginSchema(data.Body(), &masterschema.NetworkSchema{})
		return sch
	case pluginLora:
		sch, err = setPluginSchema(data.Body(), &loraschema.NetworkSchema{})
		return sch
	case pluginLoraWAN:
		sch, err = setPluginSchema(data.Body(), &loraschema.NetworkSchema{})
		return sch
	case pluginSystem:
		sch, err = setPluginSchema(data.Body(), &systemschema.NetworkSchema{})
		return sch
	case pluginEdge28:
		sch, err = setPluginSchema(data.Body(), &edge28schema.NetworkSchema{})
		return sch
	case pluginRubixIO:
		sch, err = setPluginSchema(data.Body(), &rubixioschema.NetworkSchema{})
		return sch
	}
	return sch
}

func (inst *App) GetFlowDeviceSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	url, err := setPluginURL(pluginName, "device")
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.FFProxyGET(hostUUID, url)
	if err != nil || data.StatusCode() > 299 {
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		}
		return schema.GetDefaults()
	}
	var sch interface{}
	switch pluginName {
	case pluginModbus:
		sch, err = setPluginSchema(data.Body(), &modbuschema.DeviceSchema{})
		return sch
	case pluginBACnet:
		sch, err = setPluginSchema(data.Body(), &bacnetschema.DeviceSchema{})
		return sch
	case pluginBACnetMaster:
		sch, err = setPluginSchema(data.Body(), &masterschema.DeviceSchema{})
		return sch
	case pluginLora:
		sch, err = setPluginSchema(data.Body(), &loraschema.DeviceSchema{})
		return sch
	case pluginLoraWAN:
		sch, err = setPluginSchema(data.Body(), &lorawanschema.DeviceSchema{})
		return sch
	case pluginSystem:
		sch, err = setPluginSchema(data.Body(), &systemschema.DeviceSchema{})
		return sch
	case pluginEdge28:
		sch, err = setPluginSchema(data.Body(), &edge28schema.DeviceSchema{})
		return sch
	case pluginRubixIO:
		sch, err = setPluginSchema(data.Body(), &rubixioschema.DeviceSchema{})
		return sch
	}
	return sch
}

func (inst *App) GetFlowPointSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	url, err := setPluginURL(pluginName, "point")
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.FFProxyGET(hostUUID, url)
	if err != nil || data.StatusCode() > 299 {
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		}
		return schema.GetDefaults()
	}
	var sch interface{}
	switch pluginName {
	case pluginModbus:
		sch, err = setPluginSchema(data.Body(), &modbuschema.PointSchema{})
		return sch
	case pluginBACnet:
		sch, err = setPluginSchema(data.Body(), &bacnetschema.PointSchema{})
		return sch
	case pluginBACnetMaster:
		sch, err = setPluginSchema(data.Body(), &masterschema.PointSchema{})
		return sch
	case pluginLora:
		sch, err = setPluginSchema(data.Body(), &loraschema.PointSchema{})
		return sch
	case pluginLoraWAN:
		sch, err = setPluginSchema(data.Body(), &lorawanschema.PointSchema{})
		return sch
	case pluginSystem:
		sch, err = setPluginSchema(data.Body(), &systemschema.PointSchema{})
		return sch
	case pluginEdge28:
		sch, err = setPluginSchema(data.Body(), &edge28schema.PointSchema{})
		return sch
	case pluginRubixIO:
		sch, err = setPluginSchema(data.Body(), &rubixioschema.PointSchema{})
		return sch
	}
	return sch
}
