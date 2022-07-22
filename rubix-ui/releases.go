package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/helpers/ping"
)

func (app *App) AddRelease(connUUID, hostUUID string) bool {
	host := app.GetHost(connUUID, hostUUID)
	if host == nil {
		app.crudMessage(false, fmt.Sprintf("failed to find host: %s", hostUUID))
		return false
	}
	return ping.Do(host.IP, host.Port)
}
