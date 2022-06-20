package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/helpers/humanize"
	pprint "github.com/NubeIO/rubix-ui/helpers/print"
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
Body
{
    "interface": "eth1",
    "confirm_interface": true
}
*/

/*
Set Manual IP
/api/networking/update/static
POST
{
    "interface": "eth1",
    "confirm_interface": true,
    "ip_address": "192.168.15.10",
    "netmask": "255.255.255.0",
    "gateway": "192.168.15.1"
}
*/

func (app *App) GetHostActiveNetworks(connUUID, hostUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	fmt.Println(11111)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(hostUUID, "/api/networking/networks")
	fmt.Println(22222, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	fmt.Println(22222, data.String())
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	d := humanize.Map(data.Body())
	pprint.PrintJOSN(d)
	return d
}
