package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	log "github.com/sirupsen/logrus"
	"time"
)

func (inst *App) GetHostSchema(connUUID string) interface{} {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostSchema()
	if data == nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", res.Message))
		return nil
	}
	out := map[string]interface{}{
		"properties": data,
	}
	return out
}

func (inst *App) AddHost(connUUID string, host *assistmodel.Host) *assistmodel.Host {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
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

func (inst *App) DeleteHostBulk(connUUID string, uuids []UUIDs) interface{} {
	for _, item := range uuids {
		msg, err := inst.deleteHost(connUUID, item.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete host %s %s", item.Name, msg.Message))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed host: %s", item.Name))
		}
	}
	return "ok"
}

func (inst *App) deleteHost(connUUID string, uuid string) (*assitcli.Response, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	res := client.DeleteHost(uuid)
	if res.StatusCode > 299 {
		return nil, errors.New(fmt.Sprintf("issue in deleting host network %s", res.Message))
	}
	return res, nil
}

func (inst *App) DeleteHost(connUUID string, uuid string) *assitcli.Response {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteHost(uuid)
	return res
}

func (inst *App) getHost(connUUID string, uuid string) (*assistmodel.Host, error) {
	client, err := inst.initConnection(connUUID)
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

func (inst *App) GetHost(connUUID string, uuid string) *assistmodel.Host {
	host, err := inst.getHost(connUUID, uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return host
}

func (inst *App) EditHost(connUUID string, uuid string, host *assistmodel.Host) *assistmodel.Host {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if host == nil {
		return nil
	}
	data, _ := client.UpdateHost(uuid, host)

	return data
}

func (inst *App) GetHosts(connUUID string) (resp []assistmodel.Host) {
	resp = []assistmodel.Host{}
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, _ := client.GetHosts()
	return data
}
