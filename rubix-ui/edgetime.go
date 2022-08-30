package main

import (
	"fmt"
)

func (inst *App) GetHostTime(connUUID, hostUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.EdgeSystemTime(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return data
}
