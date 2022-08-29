package main

import (
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

// GetLocalStorage this api is used for when flow-networks need to talk between each other
func (inst *App) GetLocalStorage(connUUID, hostUUID string) (*model.LocalStorageFlowNetwork, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.GetLocalStorage(hostUUID)
}

// UpdateLocalStorage this api is used for when flow-networks need to talk between each other
func (inst *App) UpdateLocalStorage(connUUID, hostUUID string, body *model.LocalStorageFlowNetwork) (*model.LocalStorageFlowNetwork, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.UpdateLocalStorage(hostUUID, body)
}
