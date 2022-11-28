package backend

import (
	"fmt"
)

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
