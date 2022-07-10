package storage

type Storage interface {
	Add(*RubixConnection) (*RubixConnection, error)
	Delete(uuid string) error
	Select(uuid string) (*RubixConnection, error)
	SelectByName(name string) (*RubixConnection, error)
	Update(string, *RubixConnection) (*RubixConnection, error)
	SelectAll() ([]RubixConnection, error)
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
	Close() error
}
