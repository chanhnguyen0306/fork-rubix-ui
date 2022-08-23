package main

import (
	"github.com/NubeIO/lib-dhcpd/dhcpd"
	"github.com/NubeIO/rubix-edge/service/system"
)

func (inst *App) EdgeDHCPPortExists(connUUID, hostUUID string, body *system.NetworkingBody) *system.Message {
	//client, err := inst.initConnectionAuth(&AssistClient{
	//	ConnUUID: connUUID,
	//})
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return  nil
	//}
	//resp, err := client.EdgeDHCPPortExists(hostUUID, body)
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return  nil
	//}
	return nil
}

func (inst *App) EdgeDHCPSetAsAuto(connUUID, hostUUID string, body *system.NetworkingBody) *system.Message {
	//client, err := inst.initConnectionAuth(&AssistClient{
	//	ConnUUID: connUUID,
	//})
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return nil
	//}
	//resp, err := client.EdgeDHCPSetAsAuto(hostUUID, body)
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return  nil
	//}
	return nil
}

func (inst *App) EdgeDHCPSetStaticIP(connUUID, hostUUID string, body *dhcpd.SetStaticIP) string {
	//client, err := inst.initConnectionAuth(&AssistClient{
	//	ConnUUID: connUUID,
	//})
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return ""
	//}
	//resp, err := client.EdgeDHCPSetStaticIP(hostUUID, body)
	//if err != nil {
	//	inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	//	return  ""
	//}
	return ""
}
