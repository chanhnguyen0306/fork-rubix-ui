package main

import (
	"fmt"
	"github.com/NubeIO/lib-schema/schema"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
)

type ConnectionSchema struct {
	UUID        schema.UUID        `json:"uuid"`
	Name        schema.Name        `json:"name"`
	Description schema.Description `json:"description"`
	IP          schema.IP          `json:"ip"`
	Port        schema.Port        `json:"port"`
	HTTPS       schema.HTTPS       `json:"https"`
	Username    schema.Username    `json:"username"`
	Password    schema.Password    `json:"password"`
}

func connectionSchema() *ConnectionSchema {
	m := &ConnectionSchema{}
	schema.Set(m)
	return m
}

func (app *App) GetConnectionSchema() *ConnectionSchema {
	c := connectionSchema()
	return c
}

func (app *App) GetConnection(uuid string) *storage.RubixConnection {
	conn, err := app.DB.Select(uuid)
	if err != nil {
		return nil
	}
	return conn
}

func (app *App) GetConnections() []storage.RubixConnection {
	conn, err := app.DB.SelectAll()
	if err != nil {
		return nil
	}
	return conn
}

func (app *App) AddConnection(conn *storage.RubixConnection) *storage.RubixConnection {
	conn, err := app.DB.Add(conn)
	if err != nil {
		return nil
	}
	return conn
}

func (app *App) UpdateConnection(uuid string, conn *storage.RubixConnection) *storage.RubixConnection {
	connection, err := app.DB.Select(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	app.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Update.String(),
		Data:     connection,
	})
	conn, err = app.DB.Update(uuid, conn)
	if err != nil {
		return nil
	}
	return conn
}

func (app *App) DeleteConnectionBulk(uuids []UUIDs) interface{} {

	for _, item := range uuids {
		msg, err := app.deleteConnection(item.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s %s", item.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed network: %s", item.Name))
		}
	}
	return "ok"
}

func (app *App) deleteConnection(uuid string) (string, error) {
	connection, err := app.DB.Select(uuid)
	if err != nil {
		return "failed to find connection to backup", err
	}
	_, err = app.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Delete.String(),
		Data:     connection,
	})
	if err != nil {
		return "", err
	}
	err = app.DB.Delete(uuid)
	if err != nil {
		return "", err
	}
	return "deleted ok", nil
}

func (app *App) DeleteConnection(uuid string) string {
	connection, err := app.DB.Select(uuid)
	if err != nil {
		return "failed to find connection to backup"
	}
	app.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Delete.String(),
		Data:     connection,
	})
	err = app.DB.Delete(uuid)
	if err != nil {
		return err.Error()
	}
	return "deleted ok"
}

type DeleteAllConnections struct {
	CountDeleted int
	Error        string
}

func (app *App) DeleteAllConnections() *DeleteAllConnections {
	resp := &DeleteAllConnections{}
	count, err := app.DB.Wipe()
	resp.CountDeleted = count
	if err != nil {
		resp.Error = err.Error()
		return resp
	}
	return resp
}
