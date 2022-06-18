package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"time"
)

func (app *App) GetHostSchema() interface{} {
	client := app.initRest()
	data, res := client.GetHostSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	} else {
	}
	return data
}

func (app *App) AddHost(host *model.Host) *model.Host {
	client := app.initRest()
	if host == nil {
		return nil
	}
	if host.NetworkUUID == "" {
		nets, _ := client.GetHostNetworks()
		for _, net := range nets {
			host.NetworkUUID = net.UUID
			break
		}
	}
	if host.Name == "" {
		host.Name = fmt.Sprintf("name_%d", time.Now().Unix())
	}
	data, _ := client.AddHost(host)
	return data
}

func (app *App) DeleteHost(uuid string) *assitcli.Response {
	client := app.initRest()
	res := client.DeleteHost(uuid)
	return res
}

func (app *App) GetHost(uuid string) *model.Host {
	client := app.initRest()
	data, _ := client.GetHost(uuid)
	return data
}

func (app *App) EditHost(uuid string, host *model.Host) *model.Host {
	client := app.initRest()
	if host == nil {
		return nil
	}
	data, _ := client.UpdateHost(uuid, host)

	return data
}

func (app *App) GetHosts() (resp []model.Host) {
	resp = []model.Host{}
	client := app.initRest()
	data, _ := client.GetHosts()
	return data
}
