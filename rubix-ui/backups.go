package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

func (app *App) addBackup(back *storage.Backup) (*storage.Backup, error) {
	if back.ConnectionName == "" {
		connection := app.GetConnection(back.ConnectionUUID)
		if connection != nil {
			back.ConnectionName = connection.Name
		}
	}
	if back.HostName == "" {
		host := app.GetHost(back.ConnectionUUID, back.HostUUID)
		if host != nil {
			back.HostName = host.Name
		}
	}
	back, err := app.DB.AddBackup(back)
	if err != nil {
		return nil, err
	}
	return back, nil
}

func (app *App) GetBackups() []storage.Backup {
	back, err := app.getBackups()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return back
}

func (app *App) getBackups() ([]storage.Backup, error) {
	back, err := app.DB.GetBackups()
	if err != nil {
		return nil, err
	}
	return back, nil
}

func (app *App) getBackupsByHostUUID(hostUUID string) ([]storage.Backup, error) {
	back, err := app.DB.GetBackupsByHostUUID(hostUUID)
	if err != nil {
		return nil, err
	}
	return back, nil
}
