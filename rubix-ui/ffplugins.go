package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

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

func (app *App) EnablePluginBulk(connUUID, hostUUID string, pluginUUID []string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	fmt.Println(pluginUUID)
	for _, plg := range pluginUUID {
		fmt.Println(plg)
		_, err := app.flow.EnablePlugin(plg)
		fmt.Println(err)
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
