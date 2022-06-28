package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/files"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
)

func (app *App) wiresUpload(connUUID, hostUUID string, body interface{}) (interface{}, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	data, resp := client.WiresUpload(hostUUID, body)
	if resp.StatusCode > 299 {
		return nil, errors.New("failed to uploads flow to wires")
	} else {
		return data, nil
	}
}

func (app *App) wiresFileUpload(connUUID, hostUUID string, fileName string) error {
	f, err := files.New().GetBackUpFile(fileName)
	if err != nil {
		return err
	}
	_, err = app.wiresUpload(connUUID, hostUUID, f)
	if err != nil {
		return err
	}
	return nil
}

func (app *App) wiresBackupUpload(connUUID, hostUUID string, body interface{}) (interface{}, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	data, resp := client.WiresUpload(hostUUID, body)
	if resp.StatusCode > 299 {
		return nil, errors.New("failed to uploads flow to wires")
	} else {
		return data, nil
	}
}

func (app *App) WiresBackupRestore(connUUID, hostUUID, backupUUID string) interface{} {
	data := app.GetBackup(backupUUID)
	backup, err := app.wiresBackupUpload(connUUID, hostUUID, data.Data)
	if err != nil {
		return err.Error()
	}
	return backup
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
