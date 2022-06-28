package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/files"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
)

func (app *App) WiresFileUpload(connUUID, hostUUID string, fileName string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return ""
	}
	f, err := files.New().GetBackUpFile(fileName)
	data, resp := client.WiresUpload(hostUUID, f)
	if resp.StatusCode > 299 {
		return "err"
	} else {
		return data
	}
}

func (app *App) wiresBackupUpload(connUUID, hostUUID string) *storage.Backup {
	app.getBackups()

	return nil
}

func (app *App) WiresBackupUpload(connUUID, hostUUID string) *storage.Backup {
	data, err := app.wiresBackup(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	backup := &storage.Backup{
		Application:    logstore.RubixWires.String(),
		ConnectionUUID: connUUID,
		HostUUID:       hostUUID,
		Data:           data,
	}
	addBackup, err := app.addBackup(backup)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return addBackup
}

func (app *App) WiresBackup(connUUID, hostUUID string) *storage.Backup {
	data, err := app.wiresBackup(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	backup := &storage.Backup{
		Application:    logstore.RubixWires.String(),
		ConnectionUUID: connUUID,
		HostUUID:       hostUUID,
		Data:           data,
	}
	addBackup, err := app.addBackup(backup)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return addBackup
}

func (app *App) wiresBackup(connUUID, hostUUID string) (interface{}, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil, errors.New(fmt.Sprintf("error %s", err.Error()))
	}
	data, err := client.WiresBackup(hostUUID)
	if err != nil {
		return nil, err
	} else {
		return data, nil
	}
}
