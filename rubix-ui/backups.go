package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	"github.com/NubeIO/rubix-ui/backend/store"
	"strings"
	"time"
)

func (inst *App) ImportBackup(body *storage.Backup) string {
	body.BackupInfo = fmt.Sprintf("was imported from host: %s connection: %s comment: %s date: %s", body.HostName, body.HostName, body.UserComment, body.Time.Format(time.RFC822))
	_, err := inst.addBackup(body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return ""
	}
	return "imported backup ok"
}

func (inst *App) ExportBackup(uuid string) {
	name, err := inst.exportBackup(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
	} else {
		inst.crudMessage(true, fmt.Sprintf("saved backup %s", name))
	}
}

func (inst *App) exportBackup(uuid string) (string, error) {
	if uuid == "" {
		return "", errors.New("uuid can not be empty")
	}
	backup, err := inst.getBackup(uuid)
	if err != nil {
		return "", err
	}
	if backup == nil {
		return "", errors.New("backup with that uuid not found")
	}
	t := time.Now().Format("2006-01-02_15-04-05")
	appStore, err := store.New(&store.Store{})
	name := fmt.Sprintf("type-%s-%s-%s", backup.SubApplication, backup.UserComment, t)
	err = appStore.SaveBackup(strings.ToLower(name), backup)
	if err != nil {
		return "", err
	}
	return name, nil
}

func (inst *App) DoBackup(connUUID, hostUUID, application, subApplication, userComment string, data interface{}) *storage.Backup {
	back := &storage.Backup{}
	back.ConnectionUUID = connUUID
	back.HostUUID = hostUUID
	back.Application = application
	back.SubApplication = subApplication
	back.UserComment = userComment
	back.Data = data
	backup, err := inst.addBackup(back)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return backup
}

func (inst *App) addBackup(back *storage.Backup) (*storage.Backup, error) {
	if back.ConnectionName == "" {
		connection := inst.GetConnection(back.ConnectionUUID)
		if connection != nil {
			back.ConnectionName = connection.Name
		}
	}
	if back.HostName == "" {
		host := inst.GetHost(back.ConnectionUUID, back.HostUUID)
		if host != nil {
			back.HostName = host.Name
		}
	}
	back, err := inst.DB.AddBackup(back)
	if err != nil {
		return nil, err
	}
	return back, nil
}

func (inst *App) GetBackupsNoData() []storage.Backup {
	back, err := inst.getBackups()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var out []storage.Backup
	for _, backup := range back {
		backup.Data = nil
		out = append(out, backup)
	}
	return out
}

func (inst *App) DeleteBackup(uuid string) string {
	err := inst.DB.DeleteBackup(uuid)
	if err != nil {
		return err.Error()
	}
	return "deleted ok"
}

func (inst *App) DeleteBackupBulk(backUUIDs []UUIDs) interface{} {
	for _, uuid := range backUUIDs {
		err := inst.DB.DeleteBackup(uuid.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("deleted backup: %s", uuid.UUID))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleted backup: %s", uuid.UUID))
		}
	}
	return "ok"
}

// GetBackupsByApplication get all backups as example RubixWires
func (inst *App) GetBackupsByApplication(application, subApplication string, withData bool) []storage.Backup {
	if application == "" {
		inst.crudMessage(false, fmt.Sprintf("error %s", "application cant not be empty"))
		return nil
	}
	back, err := inst.getBackups()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	err = logstore.CheckApplication(application)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
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

func (inst *App) GetBackups() []storage.Backup {
	back, err := inst.getBackups()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return back
}

func (inst *App) GetBackup(uuid string) *storage.Backup {
	back, err := inst.getBackup(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return back
}

func (inst *App) getBackup(uuid string) (*storage.Backup, error) {
	back, err := inst.DB.GetBackup(uuid)
	if err != nil {
		return nil, err
	}
	return back, nil
}

func (inst *App) getBackups() ([]storage.Backup, error) {
	back, err := inst.DB.GetBackups()
	if err != nil {
		return nil, err
	}
	return back, nil
}

func (inst *App) getBackupsByHostUUID(hostUUID string) ([]storage.Backup, error) {
	back, err := inst.DB.GetBackupsByHostUUID(hostUUID)
	if err != nil {
		return nil, err
	}
	return back, nil
}
