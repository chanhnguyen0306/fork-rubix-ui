package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-auth-go/user"
	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/nils"
	"sync"

	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
)

func (inst *App) errMsg(err error) error {
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return nil
}

// App struct
type App struct {
	ctx   context.Context
	DB    storage.Storage
	mutex sync.RWMutex
	store *store.Store
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.DB = storage.New("")
	str := &store.Store{
		Arch: "armv7",
	}
	appStore, err := store.New(str)
	if err != nil {
		log.Fatalf("init store on start of app err:%s", err.Error())
	}
	app.store = appStore
	return app
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
func (inst *App) initConnection(body *AssistClient) (*assitcli.Client, error) {
	var err error
	connUUID := body.ConnUUID
	if connUUID == "" {
		err = inst.errMsg(err)
		return nil, errors.New("conn can not be empty")
	}
	inst.mutex.Lock() // mutex was added had issue with "fatal error: concurrent map writes"
	defer inst.mutex.Unlock()
	if connUUID == "" {
		err = inst.errMsg(errors.New("conn can not be empty"))
		return nil, errors.New("conn can not be empty")
	}

	connection := &storage.RubixConnection{}
	if matchConnectionUUID(connUUID) {
		connection, err = inst.DB.Select(connUUID)
		if err != nil {
			err = inst.errMsg(err)
			return nil, err
		}
	} else {
		connection, err = inst.DB.SelectByName(connUUID)
		if err != nil {
			err = inst.errMsg(err)
			return nil, err
		}
	}
	if connection == nil {
		err = inst.errMsg(errors.New("failed to find a connection"))
		return nil, errors.New("failed to find a connection")
	}
	log.Infof("get connection:%s ip:%s port:%d", connUUID, connection.IP, connection.Port)
	cli := assitcli.New(&assitcli.Client{
		URL:         connection.IP,
		Port:        connection.Port,
		HTTPS:       false,
		AssistToken: connection.AssistToken,
	})
	//token := connection.AssistToken
	//if token == "" {
	//	err := inst.assistGenerateToken(connUUID, true)
	//	if err != nil {
	//		err = inst.errMsg(err)
	//	}
	//}
	//cli.AssistToken = token
	return cli, nil
}

type AssistClient struct {
	ConnUUID string
}

func (inst *App) assistGenerateToken(connUUID string, resetToken bool) error {
	connection, err := inst.getConnection(connUUID)
	if err != nil {
		return errors.New(fmt.Sprintf("get connection err:%s", err.Error()))
	}
	if connection == nil {
		return errors.New(fmt.Sprintf("connection not found :%s", connUUID))
	}
	client, err := inst.initConnection(&AssistClient{
		ConnUUID: connection.UUID,
	})
	if err != nil {
		return errors.New(fmt.Sprintf("assist-client init err:%s", err.Error()))
	}
	body := &user.User{Username: connection.Username, Password: connection.Password}
	resp, err := client.Login(body)
	if err != nil {
		return errors.New(fmt.Sprintf("assist-login err:%s", err.Error()))
	}
	jwtToken := resp.AccessToken
	tokens, err := client.GetTokens(jwtToken)
	if err != nil {
		return errors.New(fmt.Sprintf("assist-get-tokens err:%s", err.Error()))
	}
	tokenName := fmt.Sprintf("%s-%s", connection.UUID, connection.Name)
	for _, token := range tokens {
		if tokenName == token.Name {
			if resetToken {
				_, err := client.DeleteToken(jwtToken, token.UUID)
				if err != nil {
					return errors.New(fmt.Sprintf("assist-delete-token name:%s err:%s", token.Name, err.Error()))
				}
			} else {
				return errors.New(fmt.Sprintf("a token for host:%s alreay exists", connection.Name))
			}
		}
	}
	token, err := client.GenerateToken(resp.AccessToken, &assitcli.TokenCreate{
		Name:    tokenName,
		Blocked: nils.NewFalse(),
	})
	if err != nil {
		return errors.New(fmt.Sprintf("assist-generate token name:%s err:%s", tokenName, err.Error()))
	}
	connection.AssistToken = token.Token
	_, err = inst.updateConnection(connection.UUID, connection)
	if err != nil {
		return errors.New(fmt.Sprintf("update connection token in local db err:%s", err.Error()))
	}
	return nil
}
