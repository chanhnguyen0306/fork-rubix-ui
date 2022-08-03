package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/files"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
)

// wiresUpload upload a flow to wires
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

// wiresFileUpload upload to wire's from a local json file
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

func isJSON(s string) bool {
	var js interface{}
	return json.Unmarshal([]byte(s), &js) == nil
}

func (app *App) wiresBackupRestore(connUUID, hostUUID, backupUUID string) (interface{}, error) {
	data, err := app.getBackup(backupUUID)
	if err != nil {
		return nil, err
	}
	if data.Application != logstore.RubixWires.String() {
		return nil, errors.New(fmt.Sprintf("application must be of type %s:", logstore.RubixWires.String()))
	}
	//if isJSON(data.Data.(string)) {
	//	return nil, errors.New(fmt.Sprintf("no valid flow found in data %s:", logstore.RubixWires.String()))
	//}
	if data.Data == nil {
		return nil, errors.New(fmt.Sprintf("no valid flow found in data %s:", logstore.RubixWires.String()))
	}
	ret, err := app.wiresUpload(connUUID, hostUUID, data.Data)
	if err != nil {
		return nil, err
	}
	return ret, nil
}

// WiresBackupRestore upload to wire's from a backup entry
func (app *App) WiresBackupRestore(connUUID, hostUUID, backupUUID string) interface{} {
	backup, err := app.wiresBackupRestore(connUUID, hostUUID, backupUUID)
	if err != nil {
		return err.Error()
	}
	return backup
}

func (app *App) WiresBackup(connUUID, hostUUID, userComment string) *storage.Backup {
	data, err := app.wiresBackup(connUUID, hostUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	backup := &storage.Backup{
		Application:    logstore.RubixWires.String(),
		SubApplication: logstore.WiresFlow.String(),
		ConnectionUUID: connUUID,
		HostUUID:       hostUUID,
		Data:           data,
		UserComment:    userComment,
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
