package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) DeleteFlowNetworkBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := app.DeleteFlowNetwork(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetFlowNetworks(connUUID, hostUUID string, withStream bool) []model.FlowNetwork {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetwork{}
	}
	networks, err := app.flow.GetFlowNetworks(withStream)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.FlowNetwork{}
	}
	return networks
}

func (app *App) addFlowNetwork(connUUID, hostUUID string, body *model.FlowNetwork) (*model.FlowNetwork, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := app.flow.AddFlowNetwork(body)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (app *App) AddFlowNetwork(connUUID, hostUUID string, body *model.FlowNetwork) *model.FlowNetwork {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.AddFlowNetwork(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (app *App) EditFlowNetwork(connUUID, hostUUID, networkUUID string, body *model.FlowNetwork) *model.FlowNetwork {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.EditFlowNetwork(networkUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
func (app *App) DeleteFlowNetwork(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteFlowNetwork(networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getFlowNetwork(connUUID, hostUUID, networkUUID string, withStream bool) (*model.FlowNetwork, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := app.flow.GetFlowNetwork(networkUUID, withStream)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (app *App) GetFlowNetwork(connUUID, hostUUID, networkUUID string, withStream bool) *model.FlowNetwork {
	networks, err := app.getFlowNetwork(connUUID, hostUUID, networkUUID, withStream)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
