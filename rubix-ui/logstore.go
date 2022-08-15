package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

func (inst *App) GetLogs() interface{} {
	logs, err := inst.DB.GetLogs()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	var resp []storage.Log
	for _, log := range logs { //delete all the data to not show the user
		log.Data = nil
		resp = append(resp, log)

	}
	return resp
}

func (inst *App) GetLogsWithData() interface{} {
	logs, err := inst.DB.GetLogs()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	return logs
}

func (inst *App) GetLogsByConnection(connUUID string) interface{} {
	logs, err := inst.DB.GetLogsByConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	return logs
}

func (inst *App) DeleteLogBulk(logUUIDs []UUIDs) interface{} {
	for _, uuid := range logUUIDs {
		err := inst.DB.DeleteLog(uuid.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("deleted log: %s", uuid.UUID))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleted log: %s", uuid.UUID))
		}
	}
	return "ok"
}
