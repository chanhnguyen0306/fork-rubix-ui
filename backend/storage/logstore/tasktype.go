package logstore

import "errors"

type TaskType int

// go generate ./...

//go:generate stringer -type=TaskType
const (
	Create TaskType = iota
	Delete
	Update
	BackUp
	Restore
)

func CheckType(s string) error {
	switch s {
	case Create.String():
		return nil
	case Delete.String():
		return nil
	case Update.String():
		return nil
	case BackUp.String():
		return nil
	case Restore.String():
		return nil
	}

	return errors.New("invalid action type, try InstallApp or PingHost")

}
