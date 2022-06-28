package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
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

func (app *App) GetBackupsNoData() []storage.Backup {
	back, err := app.getBackups()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var out []storage.Backup
	for _, backup := range back {
		backup.Data = nil
		out = append(out, backup)
	}
	return out
}

func (app *App) DeleteBackup(uuid string) string {
	err := app.DB.DeleteBackup(uuid)
	if err != nil {
		return err.Error()
	}
	return "deleted ok"
}

// GetBackupsByApplication get all backups as example RubixWires
func (app *App) GetBackupsByApplication(application string, withData bool) []storage.Backup {
	back, err := app.getBackups()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	err = logstore.CheckApplication(application)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var out []storage.Backup
	for _, backup := range back {
		if !withData {
			backup.Data = nil
		}
		if backup.Application == application {
			out = append(out, backup)
		}
	}
	return out
}

func (app *App) GetBackups() []storage.Backup {
	back, err := app.getBackups()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return back
}

func (app *App) GetBackup(uuid string) *storage.Backup {
	back, err := app.getBackup(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return back
}

func (app *App) getBackup(uuid string) (*storage.Backup, error) {
	back, err := app.DB.GetBackup(uuid)
	if err != nil {
		return nil, err
	}
	return back, nil
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
