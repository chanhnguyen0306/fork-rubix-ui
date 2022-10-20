package backend

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteFlowNetworkCloneBulk(connUUID, hostUUID string, uuids []UUIDs) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		_, err := client.DeleteFlowNetworkClone(hostUUID, item.UUID)
		if err != nil {
			errorCount++
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		} else {
			addedCount++
		}
	}
	if addedCount > 0 {
		inst.crudMessage(true, fmt.Sprintf("delete count: %d", addedCount))
	}
	if errorCount > 0 {
		inst.crudMessage(false, fmt.Sprintf("failed to delete count: %d", errorCount))
	}
	return nil
}

func (inst *App) GetFlowNetworkClones(connUUID, hostUUID string, withDevice bool) []model.FlowNetworkClone {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	networks, err := client.GetFlowNetworkClones(hostUUID, withDevice)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetworkClone{}
	}
	return networks
}

func (inst *App) DeleteFlowNetworkClone(connUUID, hostUUID, networkUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.DeleteFlowNetworkClone(hostUUID, networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getFlowNetworkClone(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.FlowNetworkClone, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil, err
	}
	networks, err := client.GetFlowNetworkClone(hostUUID, networkUUID, withDevice)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (inst *App) GetFlowNetworkClone(connUUID, hostUUID, networkUUID string, withDevice bool) *model.FlowNetworkClone {
	networks, err := inst.getFlowNetworkClone(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
