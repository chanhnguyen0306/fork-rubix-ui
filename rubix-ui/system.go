package main

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
)

var nets = networking.New()

func (app *App) GetHostTime(connUUID, hostUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/system/time")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	d := humanize.Map(data.Body())
	return d
}

func (app *App) GetServerTime(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, msg, err := client.GetTime()
	if msg != nil || err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", msg.Message))
		return nil
	}
	j, _ := json.Marshal(data)
	d := humanize.Map(j)
	return d
}

func (app *App) GetServerNetworking(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, msg, err := client.GetNetworking()
	if msg != nil || err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", msg.Message))
		return nil
	}
	j, _ := json.Marshal(data)
	d := humanize.ArrayOfMaps(j)
	return d
}
