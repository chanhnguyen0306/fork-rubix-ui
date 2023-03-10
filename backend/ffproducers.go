package backend

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/nils"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteProducerBulk(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
			inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		} else {
			addedCount++
		}
	}
	if addedCount > 0 {
		inst.uiSuccessMessage(fmt.Sprintf("delete count: %d", addedCount))
	}
	if errorCount > 0 {
		inst.uiErrorMessage(fmt.Sprintf("failed to delete count: %d", errorCount))
	}
	return nil
}

func (inst *App) GetProducerClones(connUUID, hostUUID string) []model.Producer {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.GetProducers(hostUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	return producers
}

func (inst *App) AddProducer(connUUID, hostUUID string, body *model.Producer) *model.Producer {
	if body.ProducerThingUUID == "" {
		inst.uiErrorMessage(fmt.Sprintf("producer uuid can not be empty"))
		return nil
	}
	if body.Name == "" {
		body.Name = fmt.Sprintf("producer-%s", uuid.ShortUUID("")[5:10])
	}
	if body.ProducerThingType == "" {
		body.ProducerThingType = "point"
	}
	if body.ProducerApplication == "" {
		body.ProducerApplication = "mapping"
	}
	if nils.BoolIsNil(body.Enable) {
		body.Enable = nils.NewFalse()
	}
	if nils.BoolIsNil(body.EnableHistory) {
		body.EnableHistory = nils.NewFalse()
	}
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.AddProducer(hostUUID, body)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}

func (inst *App) EditProducer(connUUID, hostUUID, streamUUID string, body *model.Producer) *model.Producer {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	producers, err := client.EditProducer(hostUUID, streamUUID, body)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
func (inst *App) DeleteProducer(connUUID, hostUUID, streamUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteProducer(hostUUID, streamUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetProducers(connUUID, hostUUID string) []model.Producer {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return []model.Producer{}
	}
	resp, err := client.GetProducers(hostUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) getProducer(connUUID, hostUUID, streamUUID string) (*model.Producer, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
