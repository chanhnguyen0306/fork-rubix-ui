package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) DeleteFlowNetworkCloneBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := app.DeleteFlowNetworkClone(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetFlowNetworkClones(connUUID, hostUUID string, withDevice bool) []model.FlowNetworkClone {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetworkClone{}
	}
	networks, err := app.flow.GetFlowNetworkClones(withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetworkClone{}
	}
	return networks
}

func (app *App) DeleteFlowNetworkClone(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteFlowNetworkClone(networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getFlowNetworkClone(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.FlowNetworkClone, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := app.flow.GetFlowNetworkClone(networkUUID, withDevice)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (app *App) GetFlowNetworkClone(connUUID, hostUUID, networkUUID string, withDevice bool) *model.FlowNetworkClone {
	networks, err := app.getFlowNetworkClone(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
