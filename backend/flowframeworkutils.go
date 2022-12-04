package backend

import (
	"errors"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
)

func (inst *App) getFlowFrameworkVersion(assistClient *assistcli.Client, hostUUID string) (*string, error) {
	appStatus, connectionErr, requestErr := assistClient.EdgeAppStatus(hostUUID, constants.FlowFramework)
	if connectionErr != nil {
		return nil, connectionErr
	}
	if requestErr != nil {
		return nil, errors.New("flow-framework might not be installed yet")
	}
	return &appStatus.Version, nil
}

func (inst *App) restartFlowFramework(assistClient *assistcli.Client, hostUUID string) error {
	flowFrameworkServiceName := namings.GetServiceNameFromAppName(constants.FlowFramework)
	if _, err := assistClient.EdgeSystemCtlAction(hostUUID, flowFrameworkServiceName, amodel.Restart); err != nil {
		return err
	}
	return nil
}
