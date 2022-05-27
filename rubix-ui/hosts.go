package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist-client/nube/assist"
	"github.com/NubeIO/rubix-assist-model/model"
	"time"
)

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
	data, res := client.AddHost(host)
	fmt.Println("AddHost", res.GetStatus(), host.NetworkUUID)
	return data
}

func (app *App) DeleteHost(uuid string) *assist.Response {
	client := app.initRest()
	res := client.DeleteHost(uuid)
	fmt.Println("DeleteHost", res.GetStatus(), uuid)
	return res
}

func (app *App) GetHost(uuid string) *model.Host {
	client := app.initRest()
	data, res := client.GetHost(uuid)
	fmt.Println("GetHost", res.GetStatus(), data.UUID)
	return data
}

func (app *App) EditHost(uuid string, host *model.Host) *model.Host {
	client := app.initRest()
	if host == nil {
		return nil
	}
	data, res := client.UpdateHost(uuid, host)
	fmt.Println("EditHost", res.GetStatus(), host.UUID)
	return data
}

func (app *App) GetHosts() (resp []model.Host) {
	resp = []model.Host{}
	client := app.initRest()
	data, res := client.GetHosts()
	fmt.Println("GetHosts", res.GetStatus())
	return data
}
