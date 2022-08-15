package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteFlowNetworkCloneBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := inst.DeleteFlowNetworkClone(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) GetFlowNetworkClones(connUUID, hostUUID string, withDevice bool) []model.FlowNetworkClone {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetworkClone{}
	}
	networks, err := inst.flow.GetFlowNetworkClones(withDevice)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetworkClone{}
	}
	return networks
}

func (inst *App) DeleteFlowNetworkClone(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteFlowNetworkClone(networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getFlowNetworkClone(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.FlowNetworkClone, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.GetFlowNetworkClone(networkUUID, withDevice)
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
