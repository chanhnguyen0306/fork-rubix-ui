package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
)

func (inst *App) EdgeServiceStart(connUUID, hostUUID, appName string) *installer.SystemResponse {
	ctl, err := inst.edgeServiceEnable(connUUID, hostUUID, appName)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeServiceStart(connUUID, hostUUID, appName)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceStop(connUUID, hostUUID, appName string) *installer.SystemResponse {
	ctl, err := inst.edgeServiceDisable(connUUID, hostUUID, appName)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeServiceStop(connUUID, hostUUID, appName)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceRestart(connUUID, hostUUID, appName string) *installer.SystemResponse {
	ctl, err := inst.edgeServiceRestart(connUUID, hostUUID, appName)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) edgeServiceStart(connUUID, hostUUID, appName string) (*installer.SystemResponse, error) {
	body := &installer.SystemCtlBody{
		AppName: appName,
		Action:  "start",
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceStop(connUUID, hostUUID, appName string) (*installer.SystemResponse, error) {
	body := &installer.SystemCtlBody{
		AppName: appName,
		Action:  "stop",
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceRestart(connUUID, hostUUID, appName string) (*installer.SystemResponse, error) {
	body := &installer.SystemCtlBody{
		AppName: appName,
		Action:  "restart",
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceEnable(connUUID, hostUUID, appName string) (*installer.SystemResponse, error) {
	body := &installer.SystemCtlBody{
		AppName: appName,
		Action:  "enable",
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeServiceDisable(connUUID, hostUUID, appName string) (*installer.SystemResponse, error) {
	body := &installer.SystemCtlBody{
		AppName: appName,
		Action:  "disable",
	}
	resp, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) edgeRestartFlowFramework(connUUID, hostUUID string) (*installer.SystemResponse, error) {
	restart, err := inst.edgeEdgeCtlAction(connUUID, hostUUID, &installer.SystemCtlBody{ // restart flow to reload the plugins
		ServiceName: "nubeio-flow-framework.service",
		Action:      "restart",
	})
	return restart, err
}

func (inst *App) edgeEdgeCtlAction(connUUID, hostUUID string, body *installer.SystemCtlBody) (*installer.SystemResponse, error) {
	if body.ServiceName == "" && body.AppName == "" {
		return nil, errors.New("app_name & service_name both can not be empty")
	}
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeSystemCtlAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeCtlStatus(connUUID, hostUUID string, body *installer.SystemCtlBody) *installer.AppSystemState {
	resp, err := inst.edgeCtlStatus(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeCtlStatus(connUUID, hostUUID string, body *installer.SystemCtlBody) (*installer.AppSystemState, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeSystemCtlStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeServiceMassAction(connUUID, hostUUID string, body *installer.SystemCtlBody) []installer.MassSystemResponse {
	resp, err := inst.edgeServiceMassAction(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeServiceMassAction(connUUID, hostUUID string, body *installer.SystemCtlBody) ([]installer.MassSystemResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassAction(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) EdgeServiceMassStatus(connUUID, hostUUID string, body *installer.SystemCtlBody) []installer.AppSystemState {
	resp, err := inst.edgeServiceMassStatus(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeServiceMassStatus(connUUID, hostUUID string, body *installer.SystemCtlBody) ([]installer.AppSystemState, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeServiceMassStatus(hostUUID, body)
	if err != nil {
		return nil, err
	}
	return resp, err
}
