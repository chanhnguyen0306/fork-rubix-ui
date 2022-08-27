package main

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
)

var nets = networking.New()

func (inst *App) GetHostTime(connUUID, hostUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/system/time")
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		inst.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	d := humanize.Map(data.Body())
	return d
}

func (inst *App) GetServerTime(connUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, msg, err := client.GetTime()
	if msg != nil || err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", msg.Message))
		return nil
	}
	j, _ := json.Marshal(data)
	d := humanize.Map(j)
	return d
}

func (inst *App) GetServerNetworking(connUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, msg, err := client.GetNetworking()
	if msg != nil || err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", msg.Message))
		return nil
	}
	j, _ := json.Marshal(data)
	d := humanize.ArrayOfMaps(j)
	return d
}
