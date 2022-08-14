package main

import (
	"fmt"
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

func (app *App) EdgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin) *assitcli.EdgeUploadResponse {
	var lastStep = "5"
	var matchedName bool
	var matchedArch bool
	var matchedVersion bool
	plugins, err := app.assistStoreListPlugins(connUUID)
	if err != nil {
		return nil
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
		app.crudMessage(true, fmt.Sprintf("(step 1 of %s) plugin found in assist-store", lastStep))
	} else {
		plg, err := app.assistStoreUploadPlugin(connUUID, body)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
			return nil
		}
		app.crudMessage(true, fmt.Sprintf("(step 1 of %s) uploaded plugin to assist-store:%s", lastStep, plg.UploadedFile))
	}
	app.crudMessage(true, fmt.Sprintf("(step 2 of %s) start to upload plugin:%s to edge device", lastStep, body.PluginName))
	resp, err := app.edgeUploadPlugin(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
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
