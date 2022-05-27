package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist-client/nube/assist"
	"github.com/NubeIO/rubix-assist-model/model"
)

func (app *App) AddHostNetwork(host *model.Network) *model.Network {
	client := app.initRest()
	data, res := client.AddHostNetwork(host)
	fmt.Println(res.GetStatus())
	return data
}

func (app *App) GetHostNetworks() (resp []model.Network) {
	resp = []model.Network{}
	client := app.initRest()
	data, res := client.GetHostNetworks()
	fmt.Println("GetHostNetworks", res.AsString())
	return data
}

func (app *App) DeleteHostNetwork(uuid string) *assist.Response {
	client := app.initRest()
	res := client.DeleteHostNetwork(uuid)
	fmt.Println("DeleteHost", res.GetStatus(), uuid)
	return res
}

func (app *App) GetHostNetwork(uuid string) *model.Network {
	client := app.initRest()
	data, res := client.GetHostNetwork(uuid)
	fmt.Println("GetHost", res.GetStatus(), data.UUID)
	return data
}

func (app *App) EditHostNetwork(uuid string, host *model.Network) *model.Network {
	client := app.initRest()
	if host == nil {
		return nil
	}
	data, res := client.UpdateHostNetwork(uuid, host)
	fmt.Println("EditHost", res.GetStatus(), host.UUID)
	return data
}
