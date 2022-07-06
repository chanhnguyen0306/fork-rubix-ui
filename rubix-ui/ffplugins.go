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
func (app *App) GetPluginsNames(connUUID, hostUUID string) []PluginName {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := app.flow.GetPlugins()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var names []PluginName
	for _, plg := range out {
		names = append(names, PluginName{UUID: plg.UUID, Name: plg.Name})
	}
	return names
}

func (app *App) GetPluginByName(connUUID, hostUUID, pluginName string) (*model.PluginConf, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, nil
	}
	plugins, err := app.flow.GetPlugins()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, nil
	}
	for _, plg := range plugins {
		if plg.Name == pluginName {
			return &plg, nil
		}
	}
	return nil, errors.New(fmt.Sprintf("no plugin found with that name:%s", pluginName))
}

func (app *App) GetPlugin(connUUID, hostUUID, pluginUUID string) *model.PluginConf {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := app.flow.GetPlugin(pluginUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (app *App) GetPlugins(connUUID, hostUUID string) []model.PluginConf {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := app.flow.GetPlugins()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (app *App) DisablePluginBulk(connUUID, hostUUID string, pluginUUID []string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, plg := range pluginUUID {
		msg, err := app.flow.DisablePlugin(plg)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("disable plugin %s", err.Error()))
		} else {
			app.crudMessage(true, fmt.Sprintf("disable plugin %s", msg))
		}
	}
	return "ok"
}

func (app *App) EnablePluginBulk(connUUID, hostUUID string, pluginUUID []string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, plg := range pluginUUID {
		msg, err := app.flow.EnablePlugin(plg)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("enable plugin %s", err.Error()))
		} else {
			app.crudMessage(true, fmt.Sprintf("enable plugin %s", msg))
		}
	}
	return "ok"
}

func (app *App) EnablePlugin(connUUID, hostUUID, pluginUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := app.flow.EnablePlugin(pluginUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}

func (app *App) DisablePlugin(connUUID, hostUUID, pluginUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	out, err := app.flow.DisablePlugin(pluginUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return out
}
