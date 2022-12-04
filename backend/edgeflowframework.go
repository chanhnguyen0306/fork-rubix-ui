package backend

import (
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/namings"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/rumodel"
)

func (inst *App) RestartFlowFramework(connUUID, hostUUID string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	if err = inst.restartFlowFramework(assistClient, hostUUID); err != nil {
		inst.fail(err)
	}
	return inst.success("restarted flow framework successfully")
}

func (inst *App) restartFlowFramework(assistClient *assistcli.Client, hostUUID string) error {
	flowFrameworkServiceName := namings.GetServiceNameFromAppName(constants.FlowFramework)
	if _, err := assistClient.EdgeSystemCtlAction(hostUUID, flowFrameworkServiceName, amodel.Restart); err != nil {
		return err
	}
	return nil
}
