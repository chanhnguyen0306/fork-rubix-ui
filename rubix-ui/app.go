package main

import (
	"context"
	"github.com/NubeIO/rubix-assist/service/assitcli"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
	app.sendTimeToUI(ctx)
}

//initRest get rest client
func (app *App) initRest() *assitcli.Client {
	return assitcli.New("164.92.222.81", 1662)
}
