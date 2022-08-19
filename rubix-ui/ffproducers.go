package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteProducerBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := inst.DeleteProducer(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) GetProducerClones(connUUID, hostUUID string) []model.Producer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	producers, err := inst.flow.GetProducers()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	return producers
}

func (inst *App) AddProducer(connUUID, hostUUID string, body *model.Producer) *model.Producer {
	if body.Name == "" {
		body.Name = fmt.Sprintf("producer-%s", uuid.ShortUUID("")[5:10])
	}
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	producers, err := inst.flow.AddProducer(body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}

func (inst *App) EditProducer(connUUID, hostUUID, streamUUID string, body *model.Producer) *model.Producer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	producers, err := inst.flow.EditProducer(streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
func (inst *App) DeleteProducer(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteProducer(streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetProducers(connUUID, hostUUID string) []model.Producer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := inst.flow.GetProducers()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) getProducer(connUUID, hostUUID, streamUUID string) (*model.Producer, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	producers, err := inst.flow.GetProducer(streamUUID)
	if err != nil {
		return nil, err
	}
	return producers, nil
}

func (inst *App) GetProducer(connUUID, hostUUID, streamUUID string) *model.Producer {
	producers, err := inst.getProducer(connUUID, hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
