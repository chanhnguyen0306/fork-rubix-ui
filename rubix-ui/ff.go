package main

import (
	"errors"
	"fmt"
	"github.com/NubeDev/bacnet"
	"github.com/NubeDev/bacnet/btypes"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
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

func (app *App) BacnetWhois(connUUID, hostUUID string, networkUUID ...string) (*[]btypes.Device, error) {
	network, err := app.bacnetNetwork(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var netUUID string
	if len(networkUUID) > 0 {
		netUUID = networkUUID[0]
	} else {
		netUUID = network.UUID
	}
	if netUUID == "" {
		return nil, errors.New("flow network uuid can not be empty")
	}
	devices, err := app.flow.BacnetWhoIs(&bacnet.WhoIsOpts{}, netUUID, false)
	if err != nil {
		return nil, err
	}
	return devices, nil
}
