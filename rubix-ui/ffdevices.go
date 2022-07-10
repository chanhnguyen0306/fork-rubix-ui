package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/jsonschema"
	log "github.com/sirupsen/logrus"
)

func (app *App) GetFlowDeviceSchema(connUUID, hostUUID, pluginName string) interface{} {
	if pluginName == "" {
		log.Errorln("GetFlowDeviceSchema() plugin name can not be empty")
	}
	if pluginName == "system" {
		return jsonschema.GetDeviceSchema()
	} else if pluginName == "bacnetmaster" {
		return jsonschema.GetBacnetDeviceSchema()
	}
	return jsonschema.GetDeviceSchema()
}

func (app *App) GetDevices(connUUID, hostUUID string, withPoints bool) []model.Device {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	devices, err := app.flow.GetDevices(withPoints)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (app *App) AddDevice(connUUID, hostUUID string, body *model.Device) *model.Device {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	devices, err := app.flow.AddDevice(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (app *App) GetNetworkDevices(connUUID, hostUUID, networkUUID string) []*model.Device {
	net, err := app.getNetwork(connUUID, hostUUID, networkUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return net.Devices
}

func (app *App) EditDevice(connUUID, hostUUID, deviceUUID string, body *model.Device) *model.Device {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	devices, err := app.flow.EditDevice(deviceUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (app *App) DeleteDeviceBulk(connUUID, hostUUID string, deviceUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, dev := range deviceUUIDs {
		msg := app.DeleteDevice(connUUID, hostUUID, dev.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete device error: %s %s", dev.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleted device: %s", dev.Name))
		}
	}
	return "ok"
}

func (app *App) DeleteDevice(connUUID, hostUUID, deviceUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteDevice(deviceUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getDevice(connUUID, hostUUID, deviceUUID string, withPoints bool) (*model.Device, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	devices, err := app.flow.GetDevice(deviceUUID, withPoints)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (app *App) GetDevice(connUUID, hostUUID, deviceUUID string, withPoints bool) *model.Device {
	devices, err := app.getDevice(connUUID, hostUUID, deviceUUID, withPoints)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}
