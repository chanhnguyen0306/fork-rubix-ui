package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assistcli"
	log "github.com/sirupsen/logrus"
)

func (inst *App) GetHostSchema(connUUID string) *assistmodel.HostSchema {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetHostSchema()
	if data == nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", res.Message))
		return nil
	}
	return data
}

func (inst *App) AddHost(connUUID string, host *assistmodel.Host) *assistmodel.Host {
	if host.Name == "" {
		host.Name = fmt.Sprintf("host-%s", uuid.ShortUUID("")[5:10])
	}
	host.Port = 1661
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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

func (inst *App) deleteHost(connUUID string, uuid string) (*assistcli.Response, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	res := client.DeleteHost(uuid)
	if res.StatusCode > 299 {
		return nil, errors.New(fmt.Sprintf("issue in deleting host network %s", res.Message))
	}
	return res, nil
}

func (inst *App) DeleteHost(connUUID string, uuid string) *assistcli.Response {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteHost(uuid)
	return res
}

func (inst *App) getHost(connUUID string, uuid string) (*assistmodel.Host, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
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
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, _ := client.GetHosts()
	return data
}
