package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteProducerBulk(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		_, err := client.DeleteProducer(hostUUID, item.UUID)
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

func (inst *App) GetProducerClones(connUUID, hostUUID string) []model.Producer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.GetProducers(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	return producers
}

func (inst *App) AddProducer(connUUID, hostUUID string, body *model.Producer) *model.Producer {
	if body.ProducerThingUUID == "" {
		inst.crudMessage(false, fmt.Sprintf("please select a select a point or a schedule"))
		return nil
	}
	if body.Name == "" {
		body.Name = fmt.Sprintf("producer-%s", uuid.ShortUUID("")[5:10])
	}
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.AddProducer(hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}

func (inst *App) EditProducer(connUUID, hostUUID, streamUUID string, body *model.Producer) *model.Producer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.EditProducer(hostUUID, streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
func (inst *App) DeleteProducer(connUUID, hostUUID, streamUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteProducer(hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetProducers(connUUID, hostUUID string) []model.Producer {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	resp, err := client.GetProducers(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) getProducer(connUUID, hostUUID, streamUUID string) (*model.Producer, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil, err
	}
	producers, err := client.GetProducer(hostUUID, streamUUID)
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
