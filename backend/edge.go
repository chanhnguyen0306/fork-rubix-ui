package backend

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
)

func (inst *App) EdgeProductInfo(connUUID, hostUUID string) *installer.Product {
	resp, err := inst.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeProductInfo(connUUID, hostUUID string) (*installer.Product, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeProductInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) PingHost(connUUID, hostUUID string) bool {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return false
	}
	host, err := inst.getHost(connUUID, hostUUID)
	if err != nil {
		inst.uiErrorMessage(err)
		return false
	}
	_, err = client.EdgeBiosPing(hostUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("see the ip: %s & BIOS installation on it", host.IP))
		return false
	}
	inst.uiSuccessMessage(fmt.Sprintf("ip: %s is reachable", host.IP))
	return true
}

func (inst *App) EdgeRubixScan(connUUID, hostUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	data, err := client.ProxyGET(hostUUID, "/api/system/scanner")
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		inst.uiErrorMessage(fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return nil
}
