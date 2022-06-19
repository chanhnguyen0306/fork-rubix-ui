package main

import "fmt"

func (app *App) GetLogs() interface{} {
	logs, err := app.DB.GetLogs()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	//for _, log := range logs { //delete all the data to not show the user
	//	log.Data = nil
	//	logs = append(logs, log)
	//
	//}
	return logs
}

func (app *App) GetLogsWithData() interface{} {
	logs, err := app.DB.GetLogs()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	return logs
}

func (app *App) GetLogsByConnection(connUUID string) interface{} {
	logs, err := app.DB.GetLogsByConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("logs %s", err.Error()))
		return nil
	}
	return logs
}
