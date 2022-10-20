package store

import (
	"errors"
	title "github.com/NubeIO/rubix-ui/backend/helpers/case"
)

type Type int

// go generate ./...

//go:generate stringer -type=Type
const (
	FlowFramework Type = iota
	RubixWires
	NoApp
)

func CheckType(s string) (appType Type, appName string, err error) {
	s = title.TitleCaseNoSpace(s)
	if s == "" {
		return NoApp, "", errors.New("invalid app type selection was EMPTY, flow-framework")
	}
	switch s {
	case FlowFramework.String():
		return FlowFramework, FlowFramework.String(), nil
	case RubixWires.String():
		return RubixWires, RubixWires.String(), nil
	}
	return NoApp, "", errors.New("invalid app type selection was EMPTY, flow-framework")
}
