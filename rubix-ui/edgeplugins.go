package main

import (
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-assist/service/clients/edgecli"
)

func (app *App) EdgeListPlugins(connUUID, hostUUID string) []appstore.Plugin {
	resp, err := app.edgeListPlugins(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) *edgecli.Message {
	resp, err := app.edgeDeletePlugin(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeDeleteAllPlugins(connUUID, hostUUID string) *edgecli.Message {
	resp, err := app.edgeDeleteAllPlugins(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) EdgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin, restartFlow bool) *assitcli.EdgeUploadResponse {
	var lastStep = "4"
	var matchedName bool
	var matchedArch bool
	var matchedVersion bool
	if body == nil {
		app.crudMessage(false, fmt.Sprintf("plugin interface cant be empty"))
		return nil
	}
	if body.PluginName == "" {
		app.crudMessage(false, fmt.Sprintf("plugin name cant be empty"))
		return nil
	}
	if body.Arch == "" {
		app.crudMessage(false, fmt.Sprintf("plugin arch cant be empty"))
		return nil
	}
	if body.Version == "" {
		app.crudMessage(false, fmt.Sprintf("plugin version cant be empty"))
		return nil
	}
	app.crudMessage(false, fmt.Sprintf("(step 1 of %s) check plugin is in downloads plugin:%s version:%s arch:%s", lastStep, body.PluginName, body.Version, body.Arch))
	_, checkPlugin, err := app.storeGetPlugin(body)
	if checkPlugin == nil || err != nil {
		app.crudMessage(false, fmt.Sprintf("failed to find plugin:%s version:%s arch:%s", body.PluginName, body.Version, body.Arch))
		return nil
	}
	plugins, err := app.assistStoreListPlugins(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("assist check store for plugin:%s err:%s", body.PluginName, err.Error()))
	}
	for _, plg := range plugins {
		if plg.MatchedName == body.PluginName {
			matchedName = true
		}
		if plg.MatchedArch == body.Arch {
			matchedArch = true
		}
		if plg.MatchedVersion == body.Version {
			matchedVersion = true
		}
	}
	if matchedName && matchedArch && matchedVersion {
		app.crudMessage(true, fmt.Sprintf("(step 2 of %s) plugin found in assist-store", lastStep))
	} else {
		app.crudMessage(true, fmt.Sprintf("(step 2 of %s) try and upload plugin:%s to assist-store", lastStep, body.PluginName))
		plg, err := app.assistStoreUploadPlugin(connUUID, body)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
			return nil
		}
		app.crudMessage(true, fmt.Sprintf(" uploaded plugin to assist-store:%s", plg.UploadedFile))
	}
	app.crudMessage(true, fmt.Sprintf("(step 3 of %s) start to upload plugin:%s to edge device", lastStep, body.PluginName))
	resp, err := app.edgeUploadPlugin(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if restartFlow {
		app.crudMessage(true, fmt.Sprintf("(step 4 of %s) try and to restart flow-framework", lastStep))
		restart, err := app.edgeEdgeCtlAction(connUUID, hostUUID, &installer.CtlBody{ // restart flow to reload the plugins
			Service: "nubeio-flow-framework.service",
			Action:  "restart",
		})
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("restart flow-framework err:%s", err.Error()))
		} else {
			app.crudMessage(true, fmt.Sprintf("(step 4 of %s)  restart flow-framework msg:%s", lastStep, restart.Message))
		}
	}
	app.crudMessage(true, fmt.Sprintf("competed upload to edge-device %s", body.PluginName))
	return resp
}

func (app *App) edgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin) (*assitcli.EdgeUploadResponse, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeUploadPlugin(hostUUID, body)
}

func (app *App) edgeListPlugins(connUUID, hostUUID string) ([]appstore.Plugin, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeListPlugins(hostUUID)
}

func (app *App) edgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) (*edgecli.Message, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeletePlugin(hostUUID, body)
}

func (app *App) edgeDeleteAllPlugins(connUUID, hostUUID string) (*edgecli.Message, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeleteAllPlugins(hostUUID)
}
