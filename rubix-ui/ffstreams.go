package main

import (
	"fmt"

	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteStreamBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := inst.DeleteStream(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) GetStreamClones(connUUID, hostUUID string) []model.StreamClone {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.StreamClone{}
	}
	streams, err := inst.flow.GetStreamClones()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.StreamClone{}
	}
	return streams
}

func (inst *App) GetStreams(connUUID, hostUUID string) []model.Stream {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Stream{}
	}
	streams, err := inst.flow.GetStreams()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Stream{}
	}
	return streams
}

func (inst *App) AddStream(connUUID, hostUUID string, body *model.Stream) *model.Stream {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	streams, err := inst.flow.AddStream(body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}

func (inst *App) EditStream(connUUID, hostUUID, streamUUID string, body *model.Stream) *model.Stream {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	streams, err := inst.flow.EditStream(streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}
func (inst *App) DeleteStream(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteStream(streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getStream(connUUID, hostUUID, streamUUID string) (*model.Stream, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	streams, err := inst.flow.GetStream(streamUUID)
	if err != nil {
		return nil, err
	}
	return streams, nil
}

func (inst *App) GetStream(connUUID, hostUUID, streamUUID string) *model.Stream {
	streams, err := inst.getStream(connUUID, hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}
