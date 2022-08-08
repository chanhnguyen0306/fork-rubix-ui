package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	log "github.com/sirupsen/logrus"
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
		return nil
	}
	out := map[string]interface{}{
		"properties": data,
	}
	return out
}

func (app *App) AddHost(connUUID string, host *assistmodel.Host) *assistmodel.Host {
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

func (app *App) DeleteHostBulk(connUUID string, uuids []UUIDs) interface{} {
	for _, item := range uuids {
		msg, err := app.deleteHost(connUUID, item.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete host %s %s", item.Name, msg.Message))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed host: %s", item.Name))
		}
	}
	return "ok"
}

func (app *App) deleteHost(connUUID string, uuid string) (*assitcli.Response, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	res := client.DeleteHost(uuid)
	if res.StatusCode > 299 {
		return nil, errors.New(fmt.Sprintf("issue in deleting host network %s", res.Message))
	}
	return res, nil
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

func (app *App) getHost(connUUID string, uuid string) (*assistmodel.Host, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	host, resp := client.GetHost(uuid)
	if resp.StatusCode > 299 {
		errMsg := fmt.Sprintf("error on get host %s", uuid)
		log.Errorln(errMsg)
		return nil, errors.New(errMsg)
	}
	return host, nil
}

func (app *App) GetHost(connUUID string, uuid string) *assistmodel.Host {
	host, err := app.getHost(connUUID, uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return host
}

func (app *App) EditHost(connUUID string, uuid string, host *assistmodel.Host) *assistmodel.Host {
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

func (app *App) GetHosts(connUUID string) (resp []assistmodel.Host) {
	resp = []assistmodel.Host{}
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, _ := client.GetHosts()
	return data
}
