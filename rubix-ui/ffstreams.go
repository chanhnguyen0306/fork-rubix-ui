package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) DeleteStreamBulk(connUUID, hostUUID string, streamUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range streamUUIDs {
		msg := app.DeleteStream(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete stream %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed stream: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetStreamClones(connUUID, hostUUID string) []model.StreamClone {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.StreamClone{}
	}
	streams, err := app.flow.GetStreamClones()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.StreamClone{}
	}
	return streams
}

func (app *App) GetStreams(connUUID, hostUUID string) []model.Stream {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Stream{}
	}
	streams, err := app.flow.GetStreams()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Stream{}
	}
	return streams
}

func (app *App) AddStream(connUUID, hostUUID string, flowNetworkUUIDS []string, body *model.Stream) *model.Stream {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if len(flowNetworkUUIDS) == 0 {
		app.crudMessage(false, fmt.Sprintf("flow-network uuids can not be empty"))
		return nil
	}
	var flowNetworks []*model.FlowNetwork
	for _, uuid := range flowNetworkUUIDS {
		for _, network := range flowNetworks {
			network.UUID = uuid
		}
	}
	if len(flowNetworks) == 0 {
		app.crudMessage(false, fmt.Sprintf("flow-networks can not be empty"))
		return nil
	}
	body.FlowNetworks = flowNetworks
	streams, err := app.flow.AddStream(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}

func (app *App) EditStream(connUUID, hostUUID, streamUUID string, body *model.Stream) *model.Stream {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	streams, err := app.flow.EditStream(streamUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}
func (app *App) DeleteStream(connUUID, hostUUID, streamUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteStream(streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getStream(connUUID, hostUUID, streamUUID string) (*model.Stream, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	streams, err := app.flow.GetStream(streamUUID)
	if err != nil {
		return nil, err
	}
	return streams, nil
}

func (app *App) GetStream(connUUID, hostUUID, streamUUID string) *model.Stream {
	streams, err := app.getStream(connUUID, hostUUID, streamUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return streams
}
