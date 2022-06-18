package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
)

func (app *App) GetNetworkSchema() interface{} {
	client := app.initRest()
	data, res := client.GetNetworkSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	} else {
	}
	return data
}

func (app *App) AddHostNetwork(host *model.Network) *model.Network {
	client := app.initRest()
	data, res := client.AddHostNetwork(host)
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in adding new host network %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("added new host network %s", data.Name))
	}
	return data
}

func (app *App) GetHostNetworks() (resp []model.Network) {
	resp = []model.Network{}
	client := app.initRest()
	data, res := client.GetHostNetworks()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in getting host networks %s", res.Message))
	}
	return data
}

func (app *App) DeleteHostNetwork(uuid string) *assitcli.Response {
	client := app.initRest()
	res := client.DeleteHostNetwork(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in deleting host network %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("delete ok"))
	}
	return res
}

func (app *App) GetHostNetwork(uuid string) *model.Network {
	client := app.initRest()
	data, res := client.GetHostNetwork(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in getting host network %s", res.Message))
	} else {
	}
	return data
}

func (app *App) EditHostNetwork(uuid string, host *model.Network) *model.Network {
	client := app.initRest()
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
