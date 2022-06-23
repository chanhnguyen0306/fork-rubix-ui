package main

import (
	"context"
	"errors"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	storage2 "github.com/NubeIO/rubix-ui/backend/storage"
	log "github.com/sirupsen/logrus"
	"time"
)

// App struct
type App struct {
	ctx context.Context
	DB  storage2.Storage
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.DB = storage2.New("")
	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
	//app.sendTimeToUI(ctx)
}

func matchUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "con_" {
			return true
		}
	}
	return false
}

//initRest get rest client
func (app *App) initConnection(connUUID string) (*assitcli.Client, error) {
	if connUUID == "" {
		return nil, errors.New("conn can not be empty")
	}
	var err error
	connection := &storage2.RubixConnection{}
	if matchUUID(connUUID) {
		connection, err = app.DB.Select(connUUID)
		if err != nil {
			return nil, err
		}
	} else {
		connection, err = app.DB.SelectByName(connUUID)
		if err != nil {
			return nil, err
		}
	}
	if connection == nil {
		return nil, errors.New("failed to find a connection")
	}
	time.Sleep(100 * time.Millisecond)
	log.Infof("get connection:%s ip:%s port:%d", connUUID, connection.IP, connection.Port)
	return assitcli.New(connection.IP, connection.Port), nil
}
