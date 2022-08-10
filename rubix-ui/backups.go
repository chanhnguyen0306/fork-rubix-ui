package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"strings"
	"time"
)

func (app *App) ImportBackup(body *storage.Backup) string {
	body.BackupInfo = fmt.Sprintf("was imported from host:%s connection:%s comment:%s date: %s", body.HostName, body.HostName, body.UserComment, body.Time.Format(time.RFC822))
	_, err := app.addBackup(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return ""
	}
	return "imported backup ok"
}

func (app *App) ExportBackup(uuid string) {
	name, err := app.exportBackup(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	} else {
		app.crudMessage(true, fmt.Sprintf("saved backup %s", name))
	}
}

func (app *App) exportBackup(uuid string) (string, error) {
	if uuid == "" {
		return "", errors.New("uuid can not be empty")
	}
	backup, err := app.getBackup(uuid)
	if err != nil {
		return "", err
	}
	if backup == nil {
		return "", errors.New("backup with that uuid not found")
	}
	inst := &store.Store{
		App:     &installer.App{},
		Version: "latest",
		Repo:    "releases",
	}
	t := time.Now().Format("2006-01-02 15:04:05")
	appStore, err := store.New(inst)
	name := fmt.Sprintf("type-%s-%s-%s", backup.SubApplication, backup.UserComment, t)
	err = appStore.SaveBackup(strings.ToLower(name), backup)
	if err != nil {
		return "", err
	}
	return name, nil
}

func (app *App) DoBackup(connUUID, hostUUID, application, subApplication, userComment string, data interface{}) *storage.Backup {
	back := &storage.Backup{}
	back.ConnectionUUID = connUUID
	back.HostUUID = hostUUID
	back.Application = application
	back.SubApplication = subApplication
	back.UserComment = userComment
	back.Data = data
	backup, err := app.addBackup(back)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return backup
}

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

func (app *App) DeleteBackupBulk(backUUIDs []UUIDs) interface{} {
	for _, uuid := range backUUIDs {
		err := app.DB.DeleteBackup(uuid.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("deleted backup: %s", uuid.UUID))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleted backup: %s", uuid.UUID))
		}
	}
	return "ok"
}

// GetBackupsByApplication get all backups as example RubixWires
func (app *App) GetBackupsByApplication(application, subApplication string, withData bool) []storage.Backup {
	if application == "" {
		app.crudMessage(false, fmt.Sprintf("error %s", "application cant not be empty"))
		return nil
	}
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
			if subApplication != "" {
				if backup.SubApplication == subApplication {
					out = append(out, backup)
				}
			} else {
				out = append(out, backup)
			}

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
