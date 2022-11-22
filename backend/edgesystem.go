package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/model"
	"github.com/NubeIO/rubix-assist/namings"
)

func (inst *App) EdgeServiceStart(connUUID, hostUUID, appName string) *model.Message {
	ctl, err := inst.edgeSystemCtlAction(connUUID, hostUUID, appName, model.Enable)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeSystemCtlAction(connUUID, hostUUID, appName, model.Start)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceStop(connUUID, hostUUID, appName string) *model.Message {
	ctl, err := inst.edgeSystemCtlAction(connUUID, hostUUID, appName, model.Disable)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	ctl, err = inst.edgeSystemCtlAction(connUUID, hostUUID, appName, model.Stop)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeServiceRestart(connUUID, hostUUID, appName string) *model.Message {
	ctl, err := inst.edgeSystemCtlAction(connUUID, hostUUID, appName, model.Restart)
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	return ctl
}

func (inst *App) EdgeSystemCtlState(connUUID, hostUUID, appName string) *model.AppSystemState {
	resp, err := inst.edgeSystemCtlState(connUUID, hostUUID, appName)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeSystemCtlAction(connUUID, hostUUID, appName string, action model.Action) (*model.Message, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	serviceName := namings.GetServiceNameFromAppName(appName)
	return client.EdgeSystemCtlAction(hostUUID, serviceName, action)
}

func (inst *App) edgeSystemCtlState(connUUID, hostUUID, appName string) (*model.AppSystemState, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	serviceName := namings.GetServiceNameFromAppName(appName)
	resp, err := client.EdgeSystemCtlState(hostUUID, serviceName)
	if err != nil {
		return nil, err
	}
	return resp, err
}
