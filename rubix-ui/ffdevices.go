package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	log "github.com/sirupsen/logrus"
)

func (app *App) GetFlowDeviceSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	sch, err := app.flow.DeviceSchema(pluginName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return sch
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

func (app *App) addDevice(connUUID, hostUUID string, body *model.Device) (*model.Device, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	devices, err := app.flow.AddDevice(body)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (app *App) AddDevice(connUUID, hostUUID string, body *model.Device) *model.Device {
	devices, err := app.addDevice(connUUID, hostUUID, body)
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

func (app *App) ImportDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID string) *BulkAddResponse {
	resp, err := app.importPointBulk(connUUID, hostUUID, backupUUID, networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) importDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID string) (*BulkAddResponse, error) {
	if networkUUID == "" {
		return nil, errors.New("network uuid cant not be empty")
	}
	backup, err := app.getBackup(backupUUID)
	if err != nil {
		return nil, err
	}
	application := fmt.Sprintf("%s", logstore.FlowFramework)
	subApplication := fmt.Sprintf("%s", logstore.FlowFrameworkDevice)
	if backup.Application != application {
		return nil, errors.New(fmt.Sprintf("no match for application:%s", application))
	}
	if backup.SubApplication != subApplication {
		return nil, errors.New(fmt.Sprintf("no match for subApplication:%s", subApplication))
	}
	b, err := json.Marshal(backup.Data)
	var devices []model.Device
	if err := json.Unmarshal(b, &devices); err != nil {
		return nil, errors.New("failed to parse devices from backup")
	}
	var message string
	var addedCount int
	var errorCount int
	for _, device := range devices {
		device.NetworkUUID = networkUUID
		newDev, err := app.addDevice(connUUID, hostUUID, &device)
		if err != nil {
			log.Errorf(fmt.Sprintf("add device err:%s", err.Error()))
			message = fmt.Sprintf("last error on add point err:%s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add device: %s", newDev.Name))
			addedCount++
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, err
}

func (app *App) ExportDevicesBulk(connUUID, hostUUID, userComment, networkUUID string, deviceUUIDs []string) *storage.Backup {
	resp, err := app.exportDevicesBulk(connUUID, hostUUID, userComment, networkUUID, deviceUUIDs)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (app *App) exportDevicesBulk(connUUID, hostUUID, userComment, networkUUID string, deviceUUIDs []string) (*storage.Backup, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	var pointsList []model.Device
	var count int
	network, err := app.getNetwork(connUUID, hostUUID, networkUUID, true)
	if err != nil {
		return nil, err
	}
	for _, uuid := range deviceUUIDs {
		for _, device := range network.Devices {
			if device.UUID == uuid {
				pointsList = append(pointsList, *device)
			}
			count++
		}
	}
	back := &storage.Backup{}
	back.ConnectionUUID = connUUID
	back.HostUUID = hostUUID
	back.Application = fmt.Sprintf("%s", logstore.FlowFramework)
	back.SubApplication = fmt.Sprintf("%s", logstore.FlowFrameworkDevice)
	back.UserComment = fmt.Sprintf("comment:%s network-name:%s", userComment, network.Name)
	back.Data = pointsList
	backup, err := app.addBackup(back)
	if err != nil {
		return nil, err
	}
	return backup, nil
}
