package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

type PluginName struct {
	UUID string
	Name string
}

func (inst *App) RestartPluginBulk(connUUID, hostUUID string, pluginUUID []PluginUUIDs) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	for _, plg := range pluginUUID {
		_, err := client.RestartPlugin(hostUUID, plg.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("restart network driver fail: %s", plg.Name))
		} else {
			inst.crudMessage(true, fmt.Sprintf("restart network driver: %s", plg.Name))
		}
	}
	return "ok"
}

// GetPluginsNames return's an array of name and uuid
func (inst *App) GetPluginsNames(connUUID, hostUUID string) []PluginName {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	out, err := client.GetPlugins(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var names []PluginName
	for _, plg := range out {
		names = append(names, PluginName{UUID: plg.UUID, Name: plg.Name})
	}
	return names
}

func (inst *App) GetPluginByName(connUUID, hostUUID, pluginName string) (*model.PluginConf, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil, err
	}
	plugins, err := client.GetPlugins(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, nil
	}
	for _, plg := range plugins {
		if plg.Name == pluginName {
			return &plg, nil
		}
	}
	return nil, errors.New(fmt.Sprintf("no plugin found with that name: %s", pluginName))
}

func (inst *App) GetPlugin(connUUID, hostUUID, pluginUUID string) *model.PluginConf {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	out, err := client.GetPlugin(hostUUID, pluginUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) GetPlugins(connUUID, hostUUID string) []model.PluginConf {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	out, err := client.GetPlugins(hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

type PluginUUIDs struct {
	Name string `json:"name"`
	UUID string `json:"uuid"`
}

func (inst *App) DisablePluginBulk(connUUID, hostUUID string, pluginUUID []PluginUUIDs) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	for _, plg := range pluginUUID {
		_, err := client.DisablePlugin(hostUUID, plg.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("disabled modbus fail: %s", plg.Name))
		} else {
			inst.crudMessage(true, fmt.Sprintf("disabled modbus: %s", plg.Name))
		}
	}
	return "ok"
}

func (inst *App) EnablePluginBulk(connUUID, hostUUID string, pluginUUID []PluginUUIDs) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	for _, plg := range pluginUUID {
		_, err := client.EnablePlugin(hostUUID, plg.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("enable modbus fail: %s", plg.Name))
		} else {
			inst.crudMessage(true, fmt.Sprintf("enabled modbus: %s", plg.Name))
		}
	}
	return "ok"
}
