package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/edge"
	"github.com/NubeIO/rubix-ui/helpers/humanize"
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

func (app *App) GetHostActiveNetworks(connUUID, hostUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/networks")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	d := humanize.ArrayOfMaps(data.Body())
	return d
}

func (app *App) GetHostInterfaces(connUUID, hostUUID string) *edge.InterfaceNames {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/interfaces")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return data.Result().(*edge.InterfaceNames)
}

func (app *App) GetHostInternetIP(connUUID, hostUUID string) *edge.InternetIP {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/internet")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return data.Result().(*edge.InternetIP)
}

func (app *App) HostRubixScan(connUUID, hostUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/system/scanner")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	return nil
}
