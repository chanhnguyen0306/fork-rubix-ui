package main

import (
	"github.com/NubeIO/lib-schema/schema"
	"github.com/NubeIO/rubix-ui/storage"
)

type ConnectionSchema struct {
	UUID        schema.UUID        `json:"uuid"`
	Name        schema.Name        `json:"name"`
	Description schema.Description `json:"description"`
}

func connectionSchema() *ConnectionSchema {
	m := &ConnectionSchema{}
	schema.Set(m)
	return m
}

func (app *App) GetConnectionSchema() *ConnectionSchema {
	return connectionSchema()
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
	conn, err := app.DB.Update(uuid, conn)
	if err != nil {
		return nil
	}
	return conn
}

func (app *App) DeleteConnection(uuid string) string {
	err := app.DB.Delete(uuid)
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
