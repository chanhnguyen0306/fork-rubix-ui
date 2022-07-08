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

func (app *App) bacnetChecks(connUUID, hostUUID string) error {
	plugin, err := app.GetPluginByName(connUUID, hostUUID, "bacnetmaster")
	if err != nil {
		return err
	}
	if !plugin.Enabled {
		return errors.New("bacnet plugin is not enabled, please enable the plugin")
	}
	getNetwork := app.GetNetworkByPluginName(connUUID, hostUUID, "bacnetmaster", false)
	if getNetwork == nil {
		return errors.New("no network is added, please add network")
	}
	return nil
}

func (app *App) GetBacnetDevicePoints(connUUID, hostUUID, deviceUUID string, addPoints, makeWriteable bool) []model.Point {
	points, err := app.getBacnetDevicePoints(connUUID, hostUUID, deviceUUID, addPoints, makeWriteable)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("bacnet points %s", err.Error()))
		return nil
	}
	return *points
}

func (app *App) getBacnetDevicePoints(connUUID, hostUUID, deviceUUID string, addPoints, makeWriteable bool) (*[]model.Point, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	err = app.bacnetChecks(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	if deviceUUID == "" {
		return nil, errors.New("bacnet device uuid cant not be empty")
	}
	return app.flow.BacnetDevicePoints(deviceUUID, addPoints, makeWriteable)
}

func (app *App) GetNetworksWithPoints(connUUID, hostUUID string) *[]model.Network {
	err := app.bacnetChecks(connUUID, hostUUID)
	if err != nil {
		return nil
	}
	_, err = app.resetHost(connUUID, hostUUID, true)
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
	err := app.bacnetChecks(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	network, err := app.bacnetNetwork(connUUID, hostUUID)
	if err != nil {
		return nil, errors.New("no network is added, please add network")
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
