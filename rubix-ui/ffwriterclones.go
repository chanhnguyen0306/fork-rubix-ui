package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) GetWriterClones(connUUID, hostUUID string) []model.WriterClone {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.WriterClone{}
	}
	resp, err := inst.flow.GetWriterClones()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.WriterClone{}
	}
	return resp
}

func (inst *App) DeleteWriterClone(connUUID, hostUUID, uuid string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteWriterClone(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) DeleteWriterCloneBulk(connUUID, hostUUID string, UUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, item := range UUIDs {
		msg := inst.DeleteWriterClone(connUUID, hostUUID, item.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete writer %s %s", item.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed writer: %s", item.Name))
		}
	}
	return "ok"
}
