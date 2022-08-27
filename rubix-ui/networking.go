package main

import (
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/edge"
)

// Update IP and networking on host/remote devices
// will work on edge-28 and rubix-compute

/*
Network info
get active interface network api/networking/networks
get all interfaces /api/networking/interfaces
internet connection /api/networking/internet
*/

/*
DHCP
schema for updating ip /api/networking/update/schema/
POST
/api/networking/update/dhcp
*/

/*
Set Manual IP
/api/networking/update/static
POST
*/

func (inst *App) GetHostActiveNetworks(connUUID, hostUUID string) []networking.NetworkInterfaces {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := client.ProxyGET(hostUUID, "/api/networking/networks")
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if resp.IsError() {
		inst.crudMessage(false, fmt.Sprintf("error %s", resp.Error()))
		return nil
	}
	data := resp.Result().(*[]networking.NetworkInterfaces)
	return *data

}

func (inst *App) GetHostInterfaces(connUUID, hostUUID string) *edge.InterfaceNames {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/interfaces")
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		inst.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return data.Result().(*edge.InterfaceNames)
}

func (inst *App) GetHostInternetIP(connUUID, hostUUID string) *edge.InternetIP {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/internet")
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		inst.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return data.Result().(*edge.InternetIP)
}

func (inst *App) HostRubixScan(connUUID, hostUUID string) interface{} {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/system/scanner")
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		inst.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return nil
}
