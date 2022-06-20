package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
)

func (app *App) GetNetworkSchema(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetNetworkSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
		return nil
	}
	out := map[string]interface{}{
		"properties": data,
	}
	return out
}

func (app *App) AddHostNetwork(connUUID string, host *model.Network) *model.Network {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.AddHostNetwork(host)
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in adding new host network %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("added new host network %s", data.Name))
	}
	return data
}

func (app *App) GetHostNetworks(connUUID string) (resp []model.Network) {
	fmt.Println("GetHostNetworks", connUUID)
	resp = []model.Network{}
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostNetworks()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in getting host networks %s", res.Message))
	}
	return data
}

func (app *App) DeleteHostNetwork(connUUID string, uuid string) *assitcli.Response {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteHostNetwork(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in deleting host network %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("delete ok"))
	}
	return res
}

func (app *App) GetHostNetwork(connUUID string, uuid string) *model.Network {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostNetwork(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in getting host network %s", res.Message))
	} else {
	}
	return data
}

func (app *App) EditHostNetwork(connUUID string, uuid string, host *model.Network) *model.Network {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if host == nil {
		return nil
	}
	data, res := client.UpdateHostNetwork(uuid, host)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in editing host network %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("edit ok"))
	}
	return data
}
