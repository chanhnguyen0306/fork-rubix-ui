package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

type UUIDs struct {
	Name string `json:"name"`
	UUID string `json:"uuid"`
}

func (app *App) GetFlowNetworkSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	sch, err := app.flow.NetworkSchema(pluginName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return sch
}

func (app *App) DeleteNetworkBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := app.DeleteNetwork(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetNetworks(connUUID, hostUUID string, withDevice bool) []model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Network{}
	}
	networks, err := app.flow.GetNetworks(withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Network{}
	}
	return networks
}

func (app *App) AddNetwork(connUUID, hostUUID string, body *model.Network) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.AddNetwork(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (app *App) EditNetwork(connUUID, hostUUID, networkUUID string, body *model.Network) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.EditNetwork(networkUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
func (app *App) DeleteNetwork(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteNetwork(networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.Network, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := app.flow.GetNetwork(networkUUID, withDevice)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (app *App) GetNetworkByPluginName(connUUID, hostUUID, networkName string, withDevice bool) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	network, err := app.flow.GetNetworkByPluginName(networkName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return network
}

func (app *App) GetNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) *model.Network {
	networks, err := app.getNetwork(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
