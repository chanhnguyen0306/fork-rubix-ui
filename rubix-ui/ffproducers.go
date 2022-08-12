package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) DeleteProducerBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := app.DeleteProducer(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetProducerClones(connUUID, hostUUID string) []model.Producer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	producers, err := app.flow.GetProducers()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Producer{}
	}
	return producers
}

func (app *App) AddProducer(connUUID, hostUUID string, body *model.Producer) *model.Producer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	producers, err := app.flow.AddProducer(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}

func (app *App) EditProducer(connUUID, hostUUID, streamUUID string, body *model.Producer) *model.Producer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	producers, err := app.flow.EditProducer(streamUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
func (app *App) DeleteProducer(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteProducer(streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) GetProducers(connUUID, hostUUID string) []model.Producer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := app.flow.GetProducers()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) getProducer(connUUID, hostUUID, streamUUID string) (*model.Producer, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	producers, err := app.flow.GetProducer(streamUUID)
	if err != nil {
		return nil, err
	}
	return producers, nil
}

func (app *App) GetProducer(connUUID, hostUUID, streamUUID string) *model.Producer {
	producers, err := app.getProducer(connUUID, hostUUID, streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return producers
}
