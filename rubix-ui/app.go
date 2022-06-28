package main

import (
	"context"
	"errors"
	"github.com/NubeIO/rubix-assist/pkg/model"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-assist/service/clients/ffclient"
	"github.com/NubeIO/rubix-ui/backend/flow"
	"github.com/NubeIO/rubix-ui/backend/storage"
	log "github.com/sirupsen/logrus"
	"time"
)

const flowPort = 1660

// App struct
type App struct {
	ctx  context.Context
	DB   storage.Storage
	flow *ffclient.FlowClient
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.DB = storage.New("")
	app.flow = flow.New(&ffclient.Connection{
		Ip:   "0.0.0.0",
		Port: 1662,
	})
	return app
}

//resetHost will be used later to cache a host ip, port and token
func (app *App) resetHost(connUUID string, hostUUID string, resetFlow bool) (*model.Host, error) {
	host, _ := app.getHost(connUUID, hostUUID)
	if resetFlow {
		app.resetFlow(host.IP, flowPort)
	}
	return host, nil
}

func (app *App) resetFlow(ip string, port int) {
	app.flow = flow.New(&ffclient.Connection{
		Ip:   ip,
		Port: port,
	})
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
	connection := &storage.RubixConnection{}
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
