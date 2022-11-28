package backend

import (
	"fmt"
)

func (inst *App) GetSchedules(connUUID, hostUUID string) interface{} {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	err = inst.errMsg(err)
	if err != nil {
		return nil
	}
	_, err = client.GetPoints(hostUUID) // TODO change this API call
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return nil
}
