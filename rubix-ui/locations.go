package main

import (
	"fmt"

	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/assitcli"
)

func (app *App) GetLocationSchema() interface{} {
	client := app.initRest()
	data, res := client.GetLocationSchema()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("error %s", res.Message))
	} else {
	}
	return data
}

func (app *App) AddLocation(body *model.Location) *model.Location {
	client := app.initRest()
	data, res := client.AddLocation(body)
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in adding new host locations %s", res.Message))
	} else {
		// app.crudMessage(true, fmt.Sprintf("added new host location %s", data.Name))
	}
	return data
}

func (app *App) GetLocations() (resp []model.Location) {
	resp = []model.Location{}
	client := app.initRest()
	data, res := client.GetLocations()
	if data == nil {
		app.crudMessage(false, fmt.Sprintf("issue in getting host locations %s", res.Message))
	}
	return data
}

func (app *App) DeleteLocation(uuid string) *assitcli.Response {
	client := app.initRest()
	res := client.DeleteLocation(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in deleting host location %s", res.Message))
	} else {
		app.crudMessage(true, fmt.Sprintf("delete ok"))
	}
	return res
}

func (app *App) GetLocation(uuid string) *model.Location {
	client := app.initRest()
	data, res := client.GetLocation(uuid)
	if res.StatusCode > 299 {
		app.crudMessage(false, fmt.Sprintf("issue in getting host location %s", res.Message))
	} else {
	}
	return data
}

func (app *App) UpdateLocation(uuid string, host *model.Location) *model.Location {
	client := app.initRest()
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
