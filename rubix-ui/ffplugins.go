package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

type PluginName struct {
	UUID string
	Name string
}

//GetPluginsNames return's an array of name and uuid
func (inst *App) GetPluginsNames(connUUID, hostUUID string) []PluginName {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := inst.flow.GetPlugins()
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
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, nil
	}
	plugins, err := inst.flow.GetPlugins()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, nil
	}
	for _, plg := range plugins {
		if plg.Name == pluginName {
			return &plg, nil
		}
	}
	return nil, errors.New(fmt.Sprintf("no plugin found with that name:%s", pluginName))
}

func (inst *App) GetPlugin(connUUID, hostUUID, pluginUUID string) *model.PluginConf {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := inst.flow.GetPlugin(pluginUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) GetPlugins(connUUID, hostUUID string) []model.PluginConf {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := inst.flow.GetPlugins()
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
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, plg := range pluginUUID {
		_, err := inst.flow.DisablePlugin(plg.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("disabled plugin fail: %s", plg.Name))
		} else {
			inst.crudMessage(true, fmt.Sprintf("disabled plugin:%s", plg.Name))
		}
	}
	return "ok"
}

func (inst *App) EnablePluginBulk(connUUID, hostUUID string, pluginUUID []PluginUUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, plg := range pluginUUID {
		_, err := inst.flow.EnablePlugin(plg.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("enable plugin fail: %s", plg.Name))
		} else {
			inst.crudMessage(true, fmt.Sprintf("enabled plugin:%s", plg.Name))
		}
	}
	return "ok"
}

func (inst *App) EnablePlugin(connUUID, hostUUID, pluginUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := inst.flow.EnablePlugin(pluginUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) DisablePlugin(connUUID, hostUUID, pluginUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := inst.flow.DisablePlugin(pluginUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}
