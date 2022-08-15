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
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeProductInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}
