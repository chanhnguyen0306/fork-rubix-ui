package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/lib-systemctl-go/systemctl"
)

func (app *App) EdgeEdgeCtlAction(connUUID, hostUUID string, body *installer.CtlBody) *systemctl.SystemResponse {
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeEdgeCtlAction(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeCtlAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) EdgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) *systemctl.SystemResponseChecks {
	resp, err := app.edgeCtlStatus(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemResponseChecks, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeCtlStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) EdgeServiceMassAction(connUUID, hostUUID string, body *installer.CtlBody) []systemctl.MassSystemResponse {
	resp, err := app.edgeServiceMassAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeServiceMassAction(connUUID, hostUUID string, body *installer.CtlBody) ([]systemctl.MassSystemResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (app *App) EdgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) []systemctl.MassSystemResponseChecks {
	resp, err := app.edgeServiceMassStatus(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) ([]systemctl.MassSystemResponseChecks, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}
