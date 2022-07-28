package storage

import "github.com/NubeIO/rubix-ui/backend/store"

type Storage interface {
	Add(*RubixConnection) (*RubixConnection, error)
	Delete(uuid string) error
	Select(uuid string) (*RubixConnection, error)
	SelectByName(name string) (*RubixConnection, error)
	Update(string, *RubixConnection) (*RubixConnection, error)
	SelectAll() ([]RubixConnection, error)
	Close() error
	Wipe() (int, error)
	AddLog(*Log) (*Log, error)
	GetLogs() ([]Log, error)
	GetLogsByConnection(uuid string) ([]Log, error)
	DeleteLog(uuid string) error
	AddBackup(backup *Backup) (*Backup, error)
	GetBackup(uuid string) (*Backup, error)
	DeleteBackup(uuid string) error
	GetBackups() ([]Backup, error)
	GetBackupsByHostUUID(uuid string) ([]Backup, error)
	AddRelease(body *store.Release) (*store.Release, error)
	GetReleaseByVersion(version string) (*store.Release, error)
	GetRelease(uuid string) (*store.Release, error)
	GetReleases() ([]store.Release, error)
	AddSettings(body *Settings) (*Settings, error)
	UpdateSettings(body *Settings) (*Settings, error)
	DeleteSettings() error
	GetGitToken() (string, error)
	GetSetting() (*Settings, error)
}
