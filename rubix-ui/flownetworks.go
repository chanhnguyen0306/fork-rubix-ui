package main

import (
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) DeleteFlowNetworkBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := inst.DeleteFlowNetwork(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) GetFlowNetworks(connUUID, hostUUID string, withStream bool) []model.FlowNetwork {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetwork{}
	}
	networks, err := inst.flow.GetFlowNetworks(withStream)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetwork{}
	}
	return networks
}

func (inst *App) addFlowNetwork(connUUID, hostUUID string, body *model.FlowNetwork) (*model.FlowNetwork, error) {
	if body.Name == "" {
		body.Name = fmt.Sprintf("flow-%s", uuid.ShortUUID("")[5:10])
	}
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.AddFlowNetwork(body)
	if err != nil {
		return nil, err
	}

	return networks, nil
}

func (inst *App) AddFlowNetwork(connUUID, hostUUID string, body *model.FlowNetwork) *model.FlowNetwork {
	networks, err := inst.addFlowNetwork(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (inst *App) EditFlowNetwork(connUUID, hostUUID, networkUUID string, body *model.FlowNetwork) *model.FlowNetwork {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := inst.flow.EditFlowNetwork(networkUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
func (inst *App) DeleteFlowNetwork(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteFlowNetwork(networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getFlowNetwork(connUUID, hostUUID, networkUUID string, withStream bool) (*model.FlowNetwork, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.GetFlowNetwork(networkUUID, withStream)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (inst *App) GetFlowNetwork(connUUID, hostUUID, networkUUID string, withStream bool) *model.FlowNetwork {
	networks, err := inst.getFlowNetwork(connUUID, hostUUID, networkUUID, withStream)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
