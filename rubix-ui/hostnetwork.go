package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"

	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assistcli"
)

func (inst *App) GetNetworkSchema(connUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetNetworkSchema()
	if data == nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", res.Message))
		return nil
	}
	out := map[string]interface{}{
		"properties": data,
	}
	return out
}

func (inst *App) AddHostNetwork(connUUID string, host *assistmodel.Network) *assistmodel.Network {
	if host.Name == "" {
		host.Name = fmt.Sprintf("net-%s", uuid.ShortUUID("")[5:10])
	}
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.AddHostNetwork(host)
	if data == nil {
		inst.crudMessage(false, fmt.Sprintf("issue in adding new host network %s", res.Message))
	} else {
		inst.crudMessage(true, fmt.Sprintf("added new host network %s", data.Name))
	}
	return data
}

func (inst *App) GetHostNetworks(connUUID string) (resp []assistmodel.Network) {
	resp = []assistmodel.Network{}
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostNetworks()
	if data == nil {
		inst.crudMessage(false, fmt.Sprintf("issue in getting host networks %s", res.Message))
	}
	return data
}

func (inst *App) DeleteHostNetworkBulk(connUUID string, uuids []UUIDs) interface{} {
	for _, item := range uuids {
		msg, err := inst.deleteHostNetwork(connUUID, item.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete network %s %s", item.Name, msg.Message))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed network: %s", item.Name))
		}
	}
	return "ok"
}

func (inst *App) deleteHostNetwork(connUUID string, uuid string) (*assistcli.Response, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	res := client.DeleteHostNetwork(uuid)
	if res.StatusCode > 299 {
		return nil, errors.New(fmt.Sprintf("issue in deleting host network %s", res.Message))
	}
	return res, nil
}

func (inst *App) DeleteHostNetwork(connUUID string, uuid string) *assistcli.Response {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteHostNetwork(uuid)
	if res.StatusCode > 299 {
		inst.crudMessage(false, fmt.Sprintf("issue in deleting host network %s", res.Message))
	} else {
		inst.crudMessage(true, fmt.Sprintf("delete ok"))
	}
	return res
}

func (inst *App) GetHostNetwork(connUUID string, uuid string) *assistmodel.Network {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostNetwork(uuid)
	if res.StatusCode > 299 {
		inst.crudMessage(false, fmt.Sprintf("issue in getting host network %s", res.Message))
	} else {
	}
	return data
}

func (inst *App) EditHostNetwork(connUUID string, hostUUID string, host *assistmodel.Network) *assistmodel.Network {
	if host.Name == "" {
		host.Name = fmt.Sprintf("net-%s", uuid.ShortUUID("")[5:10])
	}
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if host == nil {
		return nil
	}
	data, res := client.UpdateHostNetwork(hostUUID, host)
	if res.StatusCode > 299 {
		inst.crudMessage(false, fmt.Sprintf("issue in editing host network %s", res.Message))
	} else {
		inst.crudMessage(true, fmt.Sprintf("edit ok"))
	}
	return data
}
