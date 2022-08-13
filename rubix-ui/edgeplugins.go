package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-assist/service/clients/edgecli"
)

// THIS IS FOR THE UPLOADING/DELETING A PLUGIN

func (app *App) EdgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin) *assitcli.EdgeUploadResponse {
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

func (app *App) EdgeListPlugins(connUUID, hostUUID string) []appstore.Plugin {
	resp, err := app.edgeListPlugins(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeListPlugins(connUUID, hostUUID string) ([]appstore.Plugin, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeListPlugins(hostUUID)
}

func (app *App) EdgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) *edgecli.Message {
	resp, err := app.edgeDeletePlugin(connUUID, hostUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) (*edgecli.Message, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeletePlugin(hostUUID, body)
}

func (app *App) EdgeDeleteAllPlugins(connUUID, hostUUID string) *edgecli.Message {
	resp, err := app.edgeDeleteAllPlugins(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) edgeDeleteAllPlugins(connUUID, hostUUID string) (*edgecli.Message, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeleteAllPlugins(hostUUID)
}
