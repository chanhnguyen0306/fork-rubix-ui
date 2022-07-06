package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/jsonschema"
	log "github.com/sirupsen/logrus"
)

func (app *App) GetFlowPointSchema(connUUID, hostUUID, pluginName string) interface{} {
	if pluginName == "" {
		log.Errorln("GetFlowPointSchema() plugin name can not be empty")
	}
	if pluginName == "system" {
		return jsonschema.GetPointSchema()
	} else if pluginName == "bacnetmaster" {
		return jsonschema.GetPointSchema()
	}
	return jsonschema.GetPointSchema()
}

func (app *App) GetPoints(connUUID, hostUUID string) []model.Point {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := app.flow.GetPoints()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}

func (app *App) GetPointsForDevice(connUUID, hostUUID, deviceUUID string) []*model.Point {
	device, err := app.getDevice(connUUID, hostUUID, deviceUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return device.Points
}

func (app *App) AddPoint(connUUID, hostUUID string, body *model.Point) *model.Point {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := app.flow.AddPoint(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}

func (app *App) EditPoint(connUUID, hostUUID, pointUUID string, body *model.Point) *model.Point {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := app.flow.EditPoint(pointUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}
func (app *App) DeletePoint(connUUID, hostUUID, pointUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeletePoint(pointUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) GetPoint(connUUID, hostUUID, pointUUID string) *model.Point {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := app.flow.GetPoint(pointUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}
