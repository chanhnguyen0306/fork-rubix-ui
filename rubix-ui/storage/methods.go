package storage

type Storage interface {
	Add(*RubixConnection) (*RubixConnection, error)
	Delete(uuid string) error
	Select(uuid string) (*RubixConnection, error)
	Update(string, *RubixConnection) (*RubixConnection, error)
	SelectAll() ([]RubixConnection, error)
	Wipe() (int, error)
	AddLog(*Log) (*Log, error)
	GetLogs() ([]Log, error)
	GetLogsByConnection(uuid string) ([]Log, error)
	Close() error
}
