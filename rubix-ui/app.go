package main

import (
	"context"
	"errors"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-assist/service/clients/ffclient"
	"github.com/NubeIO/rubix-ui/backend/flow"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
	"sync"
)

const flowPort = 1660

// App struct
type App struct {
	ctx   context.Context
	DB    storage.Storage
	flow  *ffclient.FlowClient
	mutex sync.RWMutex
	store *store.Store
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.DB = storage.New("")
	app.flow = flow.New(&ffclient.Connection{
		Ip:   "0.0.0.0",
		Port: 1662,
	})
	str := &store.Store{}
	appStore, err := store.New(str)
	if err != nil {
		log.Fatalf("init store on start of app err:%s", err.Error())
	}
	app.store = appStore
	return app
}

//resetHost will be used later to cache a host ip, port and token
func (inst *App) resetHost(connUUID string, hostUUID string, resetFlow bool) (*assistmodel.Host, error) {
	host, err := inst.getHost(connUUID, hostUUID)
	if err != nil {
		log.Errorf("resetHost connUUID:%s hostUUID:%s", connUUID, hostUUID)
		return nil, err
	}
	if resetFlow {
		inst.resetFlow(host.IP, flowPort)
	}
	return host, err
}

func (inst *App) resetFlow(ip string, port int) {
	inst.flow = flow.New(&ffclient.Connection{
		Ip:   ip,
		Port: port,
	})
}

// startup is called when the app starts. The context is saved, so we can call the runtime methods
func (inst *App) startup(ctx context.Context) {
	inst.ctx = ctx
	//app.sendTimeToUI(ctx)
}

func matchConnectionUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "con_" {
			return true
		}
	}
	return false
}

//initRest get rest client
func (inst *App) initConnection(connUUID string) (*assitcli.Client, error) {
	inst.mutex.Lock() // mutex was added had issue with "concurrent map read and map write"
	defer inst.mutex.Unlock()
	if connUUID == "" {
		return nil, errors.New("conn can not be empty")
	}
	var err error
	connection := &storage.RubixConnection{}
	if matchConnectionUUID(connUUID) {
		connection, err = inst.DB.Select(connUUID)
		if err != nil {
			return nil, err
		}
	} else {
		connection, err = inst.DB.SelectByName(connUUID)
		if err != nil {
			return nil, err
		}
	}
	if connection == nil {
		return nil, errors.New("failed to find a connection")
	}
	log.Infof("get connection:%s ip:%s port:%d", connUUID, connection.IP, connection.Port)
	return assitcli.New(connection.IP, connection.Port), nil
}
