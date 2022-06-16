package main

import (
	"github.com/NubeIO/rubix-ui/storage"
)

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
