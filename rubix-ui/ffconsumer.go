package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteConsumerBulk(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		_, err := client.DeleteConsumer(hostUUID, item.UUID)
		if err != nil {
			errorCount++
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		} else {
			addedCount++
		}
	}
	if addedCount > 0 {
		inst.crudMessage(true, fmt.Sprintf("delete count:%d", addedCount))
	}
	if errorCount > 0 {
		inst.crudMessage(false, fmt.Sprintf("failed to delete count:%d", errorCount))
	}
	return nil
}

func (inst *App) GetConsumerClones(connUUID, hostUUID string) []model.Consumer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	consumers, err := client.GetConsumers(hostUUID)
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
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	consumers, err := client.AddConsumer(hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}

func (inst *App) EditConsumer(connUUID, hostUUID, streamUUID string, body *model.Consumer) *model.Consumer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	consumers, err := client.EditConsumer(hostUUID, streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}
func (inst *App) DeleteConsumer(connUUID, hostUUID, streamUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteConsumer(hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetConsumers(connUUID, hostUUID string) []model.Consumer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	resp, err := client.GetConsumers(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) getConsumer(connUUID, hostUUID, streamUUID string) (*model.Consumer, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil, err
	}
	consumers, err := client.GetConsumer(hostUUID, streamUUID)
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
