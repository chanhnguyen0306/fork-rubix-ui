package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-assist/service/clients/ffclient"
)

const bacnetMaster = "bacnetmaster"

func (app *App) bacnetNetwork(connUUID, hostUUID string) (*model.Network, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	return app.flow.GetNetworkByPluginName(bacnetMaster)
}

func (app *App) GetNetworksWithPoints(connUUID, hostUUID string) *[]model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil
	}
	points, err := app.flow.GetNetworksWithPoints()
	if err != nil {

	}
	fmt.Println(points)
	return nil
}

func (app *App) bacnetWhois(connUUID, hostUUID string, networkUUID string) (*[]model.Device, error) {
	network, err := app.bacnetNetwork(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var netUUID string
	if networkUUID != "" {
		netUUID = networkUUID
	} else {
		netUUID = network.UUID
	}
	if netUUID == "" {
		return nil, errors.New("flow network uuid can not be empty")
	}
	devices, err := app.flow.BacnetWhoIs(&ffclient.WhoIsOpts{}, netUUID, false)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (app *App) BacnetWhois(connUUID, hostUUID, networkUUID string) *[]model.Device {
	devices, err := app.bacnetWhois(connUUID, hostUUID, networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices

}
