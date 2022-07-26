package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
)

func (app *App) GetLocationSchema(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetLocationSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	}
	out := map[string]interface{}{
		"properties": data,
	}
	return out
}

func (app *App) GetLocationTableSchema(connUUID string) interface{} {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetLocationSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	}
	return humanize.BuildTableSchema(data)
}

func (app *App) AddLocation(connUUID string, body *assistmodel.Location) *assistmodel.Location {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.AddLocation(body)
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in adding new host locations %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("added new host location %s", data.Name))
	}
	return data
}

func (app *App) GetLocations(connUUID string) (resp []assistmodel.Location) {
	resp = []assistmodel.Location{}
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetLocations()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in getting host locations %s", res.Message))
		return resp
	}
	return data
}

func (app *App) DeleteLocationBulk(connUUID string, uuids []UUIDs) interface{} {
	for _, item := range uuids {
		msg, err := app.deleteLocation(connUUID, item.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete location %s %s", item.Name, msg.Message))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed location: %s", item.Name))
		}
	}
	return "ok"
}

func (app *App) deleteLocation(connUUID string, uuid string) (*assitcli.Response, error) {
	client, err := app.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	res := client.DeleteLocation(uuid)
	if res.StatusCode > 299 {
		return nil, errors.New(fmt.Sprintf("issue in deleting host location %s", res.Message))
	}
	return res, nil
}

func (app *App) DeleteLocation(connUUID string, uuid string) *assitcli.Response {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	res := client.DeleteLocation(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in deleting host location %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("delete ok"))
	}
	return res
}

func (app *App) GetLocation(connUUID string, uuid string) *assistmodel.Location {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	data, res := client.GetLocation(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in getting host location %s", res.Message))
	} else {
	}
	return data
}

func (app *App) UpdateLocation(connUUID string, uuid string, host *assistmodel.Location) *assistmodel.Location {
	client, err := app.initConnection(connUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if host == nil {
		return nil
	}
	data, res := client.UpdateLocation(uuid, host)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in editing host location %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("edit ok"))
	}
	return data
}
