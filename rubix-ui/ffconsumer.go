package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteConsumerBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := inst.DeleteConsumer(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) GetConsumerClones(connUUID, hostUUID string) []model.Consumer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Consumer{}
	}
	consumers, err := inst.flow.GetConsumers()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Consumer{}
	}
	return consumers
}

func (inst *App) AddConsumer(connUUID, hostUUID string, body *model.Consumer) *model.Consumer {
	if body.ProducerUUID == "" {
		inst.crudMessage(false, fmt.Sprintf("please select a producer, eg select a point"))
		return nil
	}
	if body.Name == "" {
		body.Name = fmt.Sprintf("con-%s", uuid.ShortUUID("")[5:10])
	}
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	consumers, err := inst.flow.AddConsumer(body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}

func (inst *App) EditConsumer(connUUID, hostUUID, streamUUID string, body *model.Consumer) *model.Consumer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	consumers, err := inst.flow.EditConsumer(streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}
func (inst *App) DeleteConsumer(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteConsumer(streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetConsumers(connUUID, hostUUID string) []model.Consumer {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := inst.flow.GetConsumers()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) getConsumer(connUUID, hostUUID, streamUUID string) (*model.Consumer, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	consumers, err := inst.flow.GetConsumer(streamUUID)
	if err != nil {
		return nil, err
	}
	return consumers, nil
}

func (inst *App) GetConsumer(connUUID, hostUUID, streamUUID string) *model.Consumer {
	consumers, err := inst.getConsumer(connUUID, hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}
