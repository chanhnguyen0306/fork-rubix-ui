package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/jsonschema"
	log "github.com/sirupsen/logrus"
)

func (app *App) DeleteNetworkBulk(connUUID, hostUUID string, networkUUIDs []string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := app.DeleteNetwork(connUUID, hostUUID, net)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s", msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("delete network %s", msg))
		}
	}
	return "ok"
}

func (app *App) GetFlowNetworkSchema(connUUID, hostUUID, pluginName string) interface{} {
	if pluginName == "" {
		log.Errorln("GetFlowNetworkSchema() plugin name can not be empty")
	}
	if pluginName == "system" {
		return jsonschema.GetNetworkSystemSchema()
	} else if pluginName == "bacnetmaster" {
		return jsonschema.GetJsonNetworkSchema()
	}
	return jsonschema.GetNetworkSystemSchema()
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

func (app *App) GetNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) *model.Network {
	networks, err := app.getNetwork(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
