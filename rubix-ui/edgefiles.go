package main

import (
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
)

func (inst *App) edgeReadFile(connUUID, hostUUID, path string) ([]byte, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeReadFile(hostUUID, path)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) edgeWriteFile(connUUID, hostUUID string, body *assitcli.WriteFile) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.EdgeWriteFile(hostUUID, body)
}

func (inst *App) edgeWriteFileJson(connUUID, hostUUID string, body *assitcli.WriteFile) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.EdgeWriteFileJson(hostUUID, body)
}

func (inst *App) edgeWriteFileYml(connUUID, hostUUID string, body *assitcli.WriteFile) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.EdgeWriteFileYml(hostUUID, body)
}

func (inst *App) edgeCreateFile(connUUID, hostUUID string, body *assitcli.WriteFile) (*assitcli.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.EdgeCreateFile(hostUUID, body)
}
