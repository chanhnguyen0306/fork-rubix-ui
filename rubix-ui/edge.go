package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
)

func (inst *App) EdgeProductInfo(connUUID, hostUUID string) *installer.Product {
	resp, err := inst.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeProductInfo(connUUID, hostUUID string) (*installer.Product, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
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
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return false
	}
	host, err := inst.getHost(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("no device on ip:%s", host.IP))
		return false
	}
	ping, err := client.AssistPing(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("ping fail on ip:%s", host.IP))
		return false
	}
	if ping {
		inst.crudMessage(true, fmt.Sprintf("ping ok ip:%s", host.IP))
	} else {
		inst.crudMessage(false, fmt.Sprintf("ping fail on ip:%s", host.IP))
	}

	return ping
}

func (inst *App) GetHostPublicInfo(connUUID, hostUUID string) bool {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return false
	}
	info, err := client.EdgePublicInfo(hostUUID)
	host, err := inst.getHost(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("device not found"))
		return false
	}
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("no found ip:%s", host.IP))
		return false
	}
	if info != nil {
		for _, interfaces := range info.Networking {
			if info.Device.DeviceName != "na" {
				if info.Device.DeviceName != "" {
					if host.IP == interfaces.IP {
						inst.crudMessage(true, fmt.Sprintf("device name:%s product:%s interface:%s ip:%s", info.Device.DeviceName, info.Product.Product, interfaces.Interface, interfaces.IP))
					}
				}
			} else {
				if host.IP == interfaces.IP {
					inst.crudMessage(true, fmt.Sprintf("device:%s interface:%s ip:%s", info.Product.Product, interfaces.Interface, interfaces.IP))
				}
			}
		}
	} else {
		host, err := inst.getHost(connUUID, hostUUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("device not found"))
			return false
		}
		inst.crudMessage(false, fmt.Sprintf("no found ip:%s", host.IP))
	}
	return true
}

func (inst *App) EdgeRubixScan(connUUID, hostUUID string) interface{} {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
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
