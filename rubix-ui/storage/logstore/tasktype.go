package logstore

import "errors"

type TaskType int

// go generate ./...

//go:generate stringer -type=TaskType
const (
	Add TaskType = iota
	Delete
	Edit
	BackUp
	Restore
)

func CheckType(s string) error {
	switch s {
	case Add.String():
		return nil
	case Delete.String():
		return nil
	case Edit.String():
		return nil
	case BackUp.String():
		return nil
	case Restore.String():
		return nil
	}

	return errors.New("invalid action type, try InstallApp or PingHost")

}
