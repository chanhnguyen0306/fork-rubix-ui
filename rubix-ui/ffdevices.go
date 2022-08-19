package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	log "github.com/sirupsen/logrus"
)

func (inst *App) GetDevices(connUUID, hostUUID string, withPoints bool) []model.Device {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	devices, err := inst.flow.GetDevices(withPoints)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (inst *App) AddDevicesBulk(connUUID, hostUUID string, body []model.Device) {
	var addedCount int
	var errorCount int
	for _, dev := range body {
		_, err := inst.addDevice(connUUID, hostUUID, &dev)
		if err != nil {
			errorCount++
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		} else {
			addedCount++
		}
	}
	if addedCount > 0 {
		inst.crudMessage(true, fmt.Sprintf("added count:%d", addedCount))
	}
	if errorCount > 0 {
		inst.crudMessage(false, fmt.Sprintf("failed to add count:%d", errorCount))
	}

}

func (inst *App) addDevice(connUUID, hostUUID string, body *model.Device) (*model.Device, error) {
	if body.Name == "" {
		body.Name = fmt.Sprintf("device-%s", uuid.ShortUUID("")[5:10])
	}
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	devices, err := inst.flow.AddDevice(body)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (inst *App) AddDevice(connUUID, hostUUID string, body *model.Device) *model.Device {
	devices, err := inst.addDevice(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (inst *App) GetNetworkDevices(connUUID, hostUUID, networkUUID string) []*model.Device {
	net, err := inst.getNetwork(connUUID, hostUUID, networkUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return net.Devices
}

func (inst *App) EditDevice(connUUID, hostUUID, deviceUUID string, body *model.Device) *model.Device {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	devices, err := inst.flow.EditDevice(deviceUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (inst *App) DeleteDeviceBulk(connUUID, hostUUID string, deviceUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, dev := range deviceUUIDs {
		msg := inst.DeleteDevice(connUUID, hostUUID, dev.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete device error: %s %s", dev.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleted device: %s", dev.Name))
		}
	}
	return "ok"
}

func (inst *App) DeleteDevice(connUUID, hostUUID, deviceUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteDevice(deviceUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getDevice(connUUID, hostUUID, deviceUUID string, withPoints bool) (*model.Device, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	devices, err := inst.flow.GetDevice(deviceUUID, withPoints)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (inst *App) GetDevice(connUUID, hostUUID, deviceUUID string, withPoints bool) *model.Device {
	devices, err := inst.getDevice(connUUID, hostUUID, deviceUUID, withPoints)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return devices
}

func (inst *App) ImportDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID string) *BulkAddResponse {
	resp, err := inst.importDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) importDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID string) (*BulkAddResponse, error) {
	if networkUUID == "" {
		return nil, errors.New("network uuid cant not be empty")
	}
	backup, err := inst.getBackup(backupUUID)
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
		newDev, err := inst.addDevice(connUUID, hostUUID, &device)
		if err != nil {
			log.Errorf(fmt.Sprintf("add device err:%s", err.Error()))
			message = fmt.Sprintf("last error on add device err:%s", err.Error())
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

func (inst *App) ExportDevicesBulk(connUUID, hostUUID, userComment, networkUUID string, deviceUUIDs []string) *storage.Backup {
	resp, err := inst.exportDevicesBulk(connUUID, hostUUID, userComment, networkUUID, deviceUUIDs)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) exportDevicesBulk(connUUID, hostUUID, userComment, networkUUID string, deviceUUIDs []string) (*storage.Backup, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	var pointsList []model.Device
	var count int
	network, err := inst.getNetwork(connUUID, hostUUID, networkUUID, true)
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
	backup, err := inst.addBackup(back)
	if err != nil {
		return nil, err
	}
	return backup, nil
}
