package logstore

import "errors"

type ApplicationType int

// go generate ./...

//go:generate stringer -type=ApplicationType
const (
	RubixWires ApplicationType = iota
	FlowFramework
)

func CheckApplication(s string) error {
	switch s {
	case RubixWires.String():
		return nil
	case FlowFramework.String():
		return nil
	}
	return errors.New("invalid action type, try Fail or RubixWires or FlowFramework")
}
