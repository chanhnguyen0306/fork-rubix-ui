package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
)

func (app *App) EdgeProductInfo(connUUID, hostUUID string) *installer.Product {
	resp, err := app.edgeProductInfo(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeProductInfo(connUUID, hostUUID string) (*installer.Product, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeProductInfo(hostUUID)
	if err != nil {
		return nil, err
	}
	return resp, err
}
