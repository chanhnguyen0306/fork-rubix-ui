package main

import (
	"context"
	"errors"
	"github.com/NubeIO/rubix-ui/storage"

	"github.com/NubeIO/rubix-assist/service/assitcli"
)

// App struct
type App struct {
	ctx context.Context
	DB  storage.Storage
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.DB = storage.New("")
	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
	app.sendTimeToUI(ctx)
}

type Conn struct {
	UUID string
}

func (app *App) getConnection(connUUID string) *Conn {
	return &Conn{
		UUID: connUUID,
	}
}

//initRest get rest client
func (app *App) initConnection(conn *Conn) (*assitcli.Client, error) {
	if conn != nil {
		return nil, errors.New("conn can not be empty")
	}
	connection, err := app.DB.Select(conn.UUID)
	if err != nil {
		return nil, err
	}
	return assitcli.New(connection.Connection.Ip, connection.Connection.Port), nil
}

//initRest get rest client
func (app *App) initRest() *assitcli.Client {

	return assitcli.New("164.92.222.81", 1662)
}
