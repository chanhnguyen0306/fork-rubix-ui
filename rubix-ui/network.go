package main

import (
	"fmt"
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
