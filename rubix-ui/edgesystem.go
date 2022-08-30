package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/lib-systemctl-go/systemctl"
)

func (inst *App) EdgeServiceStart(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	ctl, err := inst.edgeServiceEnable(connUUID, hostUUID, appOrService, timeout)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeServiceStart(connUUID, hostUUID, appOrService, timeout)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceStop(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	ctl, err := inst.edgeServiceDisable(connUUID, hostUUID, appOrService, timeout)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeServiceStop(connUUID, hostUUID, appOrService, timeout)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceRestart(connUUID, hostUUID, appOrService string, timeout int) *systemctl.SystemResponse {
	ctl, err := inst.edgeServiceRestart(connUUID, hostUUID, appOrService, timeout)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) edgeServiceStart(connUUID, hostUUID, appOrService string, timeout int) (*systemctl.SystemResponse, error) {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "start",
		Timeout: timeout,
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceStop(connUUID, hostUUID, appOrService string, timeout int) (*systemctl.SystemResponse, error) {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "stop",
		Timeout: timeout,
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceRestart(connUUID, hostUUID, appOrService string, timeout int) (*systemctl.SystemResponse, error) {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "restart",
		Timeout: timeout,
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceEnable(connUUID, hostUUID, appOrService string, timeout int) (*systemctl.SystemResponse, error) {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "enable",
		Timeout: timeout,
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceDisable(connUUID, hostUUID, appOrService string, timeout int) (*systemctl.SystemResponse, error) {
	body := &installer.CtlBody{
		Service: appOrService,
		Action:  "disable",
		Timeout: timeout,
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeRestartFlowFramework(connUUID, hostUUID string) (*systemctl.SystemResponse, error) {
	restart, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, &installer.CtlBody{ // restart flow to reload the plugins
		Service: "nubeio-flow-framework.service",
		Action:  "restart",
	})
	return restart, err
}

func (inst *App) edgeEdgeCtlAction(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemResponse, error) {
	if body.Service == "" {
		return nil, errors.New("service-name can not be empty")
	}
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeCtlAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) *systemctl.SystemState {
	resp, err := inst.edgeCtlStatus(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeCtlStatus(connUUID, hostUUID string, body *installer.CtlBody) (*systemctl.SystemState, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeCtlStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeServiceMassAction(connUUID, hostUUID string, body *installer.CtlBody) []systemctl.MassSystemResponse {
	resp, err := inst.edgeServiceMassAction(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeServiceMassAction(connUUID, hostUUID string, body *installer.CtlBody) ([]systemctl.MassSystemResponse, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) []systemctl.SystemState {
	resp, err := inst.edgeServiceMassStatus(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeServiceMassStatus(connUUID, hostUUID string, body *installer.CtlBody) ([]systemctl.SystemState, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}
