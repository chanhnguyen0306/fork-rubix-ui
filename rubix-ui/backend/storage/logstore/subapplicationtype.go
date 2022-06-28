package logstore

import "errors"

type SubApplicationType int

// go generate ./...

//go:generate stringer -type=SubApplicationType
const (
	FlowFrameworkNetwork SubApplicationType = iota
	FlowFrameworkDevice
	FlowFrameworkPoint
	FlowFrameworkFlowNetwork
	FlowFrameworkFlowNetworkClone
	WiresFlow
	Plugins
	Apps
	AppsStore
)

func CheckSubApplication(s string) error {
	switch s {
	case FlowFrameworkNetwork.String():
		return nil
	case FlowFrameworkDevice.String():
		return nil
	case FlowFrameworkPoint.String():
		return nil
	case FlowFrameworkFlowNetwork.String():
		return nil
	case FlowFrameworkFlowNetworkClone.String():
		return nil
	case WiresFlow.String():
		return nil
	case Plugins.String():
		return nil
	case Apps.String():
		return nil
	case AppsStore.String():
		return nil
	}
	return errors.New("invalid action type, try Fail or RubixWires or FlowFramework")
}
