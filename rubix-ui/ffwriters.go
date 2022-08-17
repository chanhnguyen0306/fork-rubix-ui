package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) CreateWriter(connUUID, hostUUID string, body *model.Writer) *model.Writer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := inst.flow.CreateWriter(body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) GetWriters(connUUID, hostUUID string) []model.Writer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Writer{}
	}
	resp, err := inst.flow.GetWriters()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Writer{}
	}
	return resp
}

func (inst *App) EditWriter(connUUID, hostUUID, uuid string, body *model.Writer, updateProducer bool) *model.Writer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := inst.flow.EditWriter(uuid, body, updateProducer)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) DeleteWriter(connUUID, hostUUID, uuid string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteWriter(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) DeleteWritersBulk(connUUID, hostUUID string, UUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, item := range UUIDs {
		msg := inst.DeleteWriter(connUUID, hostUUID, item.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete writer %s %s", item.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed writer: %s", item.Name))
		}
	}
	return "ok"
}
