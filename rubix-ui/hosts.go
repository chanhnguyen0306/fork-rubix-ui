package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"time"
)

func (app *App) GetHostSchema(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	} else {
	}
	return data
}

func (app *App) AddHost(connUUID string, host *model.Host) *model.Host {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
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

func (app *App) DeleteHost(connUUID string, uuid string) *assitcli.Response {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteHost(uuid)
	return res
}

func (app *App) GetHost(connUUID string, uuid string) *model.Host {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, _ := client.GetHost(uuid)
	return data
}

func (app *App) EditHost(connUUID string, uuid string, host *model.Host) *model.Host {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if host == nil {
		return nil
	}
	data, _ := client.UpdateHost(uuid, host)

	return data
}

func (app *App) GetHosts(connUUID string) (resp []model.Host) {
	resp = []model.Host{}
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, _ := client.GetHosts()
	return data
}
