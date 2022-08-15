package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/lib-systemctl-go/systemctl"
)

func (app *App) EdgeServiceStart(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "start",
		Timeout: timeout,
	}
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeServiceStop(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "stop",
		Timeout: timeout,
	}
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeServiceRestart(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "restart",
		Timeout: timeout,
	}
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeServiceEnable(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "enable",
		Timeout: timeout,
	}
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeServiceDisable(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "disable",
		Timeout: timeout,
	}
	resp, err := app.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeEdgeCtlAction(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemResponse, error) {
	if body.Service == "" {
		return nil, errors.New("service-name can not be empty")
	}
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

func (app *App) EdgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) *systemctl.SystemState {
	resp, err := app.edgeCtlStatus(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemState, error) {
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

func (app *App) EdgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) []systemctl.SystemState {
	resp, err := app.edgeServiceMassStatus(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) ([]systemctl.SystemState, error) {
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
