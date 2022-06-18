package main

import (
	"context"
	"errors"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-ui/storage"
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

//initRest get rest client
func (app *App) initConnection(connUUID string) (*assitcli.Client, error) {
	if connUUID == "" {
		return nil, errors.New("conn can not be empty")
	}
	connection, err := app.DB.Select(connUUID)
	if err != nil {
		return nil, err
	}
	return assitcli.New(connection.IP, connection.Port), nil
}

//initRest get rest client
func (app *App) initRest() *assitcli.Client {

	return assitcli.New("0.0.0.0", 1662)
}
