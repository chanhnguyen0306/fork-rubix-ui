package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/helpers/humanize"
)

func (app *App) GetTime(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, err := client.ProxyGET(connUUID, "api/system/time")
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if data.IsError() {
		app.crudMessage(false, fmt.Sprintf("error %s", data.Error()))
		return nil
	}
	d := humanize.Humanize(data.Body())
	fmt.Println(d, 9999)

	return d
}
