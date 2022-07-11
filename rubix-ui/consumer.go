package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) DeleteConsumerBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := app.DeleteConsumer(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetConsumerClones(connUUID, hostUUID string) []model.Consumer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Consumer{}
	}
	consumers, err := app.flow.GetConsumers()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Consumer{}
	}
	return consumers
}

func (app *App) AddConsumer(connUUID, hostUUID string, body *model.Consumer) *model.Consumer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	consumers, err := app.flow.AddConsumer(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}

func (app *App) EditConsumer(connUUID, hostUUID, streamUUID string, body *model.Consumer) *model.Consumer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	consumers, err := app.flow.EditConsumer(streamUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}
func (app *App) DeleteConsumer(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteConsumer(streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) GetConsumers(connUUID, hostUUID string) []model.Consumer {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	resp, err := app.flow.GetConsumers()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) getConsumer(connUUID, hostUUID, streamUUID string) (*model.Consumer, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	consumers, err := app.flow.GetConsumer(streamUUID)
	if err != nil {
		return nil, err
	}
	return consumers, nil
}

func (app *App) GetConsumer(connUUID, hostUUID, streamUUID string) *model.Consumer {
	consumers, err := app.getConsumer(connUUID, hostUUID, streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return consumers
}
