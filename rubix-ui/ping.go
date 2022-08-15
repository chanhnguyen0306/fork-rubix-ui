package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/helpers/ping"
)

func (inst *App) PingRubixAssist(connUUID string) bool {
	connection, err := inst.DB.Select(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return false
	}
	return ping.Do(connection.IP, connection.Port)
}

func (inst *App) PingHost(connUUID, hostUUID string) bool {
	host := inst.GetHost(connUUID, hostUUID)
	if host == nil {
		inst.crudMessage(false, fmt.Sprintf("failed to find host: %s", hostUUID))
		return false
	}
	return ping.Do(host.IP, host.Port)
}
