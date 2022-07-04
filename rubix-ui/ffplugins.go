package main

import (
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
		_, err := app.flow.DisablePlugin(plg)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
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
		_, err := app.flow.EnablePlugin(plg)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
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
