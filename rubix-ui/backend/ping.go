package backend

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
