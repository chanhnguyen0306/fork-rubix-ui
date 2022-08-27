package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteStreamBulk(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		_, err := client.DeleteStream(hostUUID, item.UUID)
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

func (inst *App) DeleteStreamBulkClones(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		_, err := client.DeleteStreamClone(hostUUID, item.UUID)
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

func (inst *App) GetStreamClones(connUUID, hostUUID string) []model.StreamClone {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	streams, err := client.GetStreamClones(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.StreamClone{}
	}
	return streams
}

func (inst *App) GetStreams(connUUID, hostUUID string) []model.Stream {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	streams, err := client.GetStreams(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Stream{}
	}
	return streams
}

func (inst *App) AddStream(connUUID, hostUUID string, flowNetworkUUIDS []string, body *model.Stream) *model.Stream {
	if body.Name == "" {
		body.Name = fmt.Sprintf("stream-%s", uuid.ShortUUID("")[5:10])
	}
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	if len(flowNetworkUUIDS) == 0 {
		inst.crudMessage(false, fmt.Sprintf("flow-network uuids can not be empty"))
		return nil
	}
	var flowNetworks []*model.FlowNetwork
	flowNetwork := &model.FlowNetwork{}
	flowNetworks = append(flowNetworks, flowNetwork) //TODO fix this logic, it was done quick without thinking it through
	for _, uuid := range flowNetworkUUIDS {
		for _, network := range flowNetworks {
			network.UUID = uuid
		}
	}
	if len(flowNetworks) == 0 {
		inst.crudMessage(false, fmt.Sprintf("flow-networks can not be empty"))
		return nil
	}
	body.FlowNetworks = flowNetworks
	streams, err := client.AddStream(hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}
func (inst *App) EditStream(connUUID, hostUUID, streamUUID string, body *model.Stream) *model.Stream {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	streams, err := client.EditStream(hostUUID, streamUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}

func (inst *App) DeleteStream(connUUID, hostUUID, streamUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteStream(hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) DeleteStreamClone(connUUID, hostUUID, streamUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteStreamClone(hostUUID, streamUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getStream(connUUID, hostUUID, streamUUID string) (*model.Stream, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil, err
	}
	streams, err := client.GetStream(hostUUID, streamUUID)
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
