package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/stretchr/objx"
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

type TableSchema struct {
	Title string `json:"title"`
	Key   string `json:"key"`
	Index string `json:"dataIndex"`
}

func BuildTableSchema(data interface{}) []TableSchema {
	var schema []TableSchema
	for i, value := range objx.New(data) {
		v := objx.New(value)
		title := ""
		key := i
		index := key
		for k, v := range v {
			if k == "title" {
				title = v.(string)
			}
		}
		schema = append(schema, TableSchema{Title: title, Key: key, Index: index})
	}
	return schema
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
	return BuildTableSchema(data)
}

func (app *App) AddLocation(connUUID string, body *model.Location) *model.Location {
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

func (app *App) GetLocations(connUUID string) (resp []model.Location) {
	resp = []model.Location{}
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

func (app *App) GetLocation(connUUID string, uuid string) *model.Location {
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

func (app *App) UpdateLocation(connUUID string, uuid string, host *model.Location) *model.Location {
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
