package main

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
)

var nets = networking.New()

func (inst *App) GetServerTime(connUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
