package logstore

import "errors"

type FunctionType int

// go generate ./...

//go:generate stringer -type=FunctionType
const (
	Connection FunctionType = iota
	Location
	Network
	Device
)

func CheckFunction(s string) error {
	switch s {
	case Connection.String():
		return nil
	case Location.String():
		return nil
	case Network.String():
		return nil
	case Device.String():
		return nil
	}
	return errors.New("invalid action type, try Fail or Completed")
}
