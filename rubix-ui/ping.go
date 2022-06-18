package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/helpers/ping"
)

func (app *App) PingRubixAssist(connUUID string) bool {
	connection, err := app.DB.Select(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return false
	}
	return ping.Do(connection.IP, connection.Port)
}

func (app *App) PingHost(connUUID, hostUUID string) bool {
	host := app.GetHost(connUUID, hostUUID)
	if host == nil {
		app.crudMessage(false, fmt.Sprintf("failed to find host: %s", hostUUID))
		return false
	}
	return ping.Do(host.IP, host.Port)
}
