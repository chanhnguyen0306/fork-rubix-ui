package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	log "github.com/sirupsen/logrus"
)

func (inst *App) bulkAddPoints(connUUID, hostUUID, deviceUUID string, points []*model.Point) (*BulkAddResponse, error) {
	if deviceUUID == "" {
		return nil, errors.New("device uuid can not be empty")
	}
	var message string
	var addedCount int
	var errorCount int
	for _, point := range points {
		point.DeviceUUID = deviceUUID
		addPoint, err := inst.addPoint(connUUID, hostUUID, point)
		if err != nil {
			log.Errorf(fmt.Sprintf("add point err: %s", err.Error()))
			message = fmt.Sprintf("last error on add point err: %s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add point: %s", addPoint.Name))
			addedCount++
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, nil
}

func (inst *App) bulkAddDevices(connUUID, hostUUID, networkUUID string, devices []*model.Device, addPoints bool) (*BulkAddResponse, error) {
	if networkUUID == "" {
		return nil, errors.New("network uuid can not be empty")
	}
	var message string
	var addedCount int
	var errorCount int
	for _, device := range devices {
		device.NetworkUUID = networkUUID
		added, err := inst.addDevice(connUUID, hostUUID, device)
		if err != nil {
			log.Errorf(fmt.Sprintf("add device err: %s", err.Error()))
			message = fmt.Sprintf("last error on add device err: %s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add device: %s", added.Name))
			addedCount++
			if addPoints {
				_, err := inst.bulkAddPoints(connUUID, hostUUID, device.UUID, device.Points)
				if err != nil {
					return nil, err
				}
			}
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, nil
}

func (inst *App) bulkAddNetworks(connUUID, hostUUID string, networks []*model.Network, importDevices bool) (*BulkAddResponse, error) {
	var message string
	var addedCount int
	var errorCount int
	for _, net := range networks {
		added, err := inst.addNetwork(connUUID, hostUUID, net)
		if err != nil {
			log.Errorf(fmt.Sprintf("add network err: %s", err.Error()))
			message = fmt.Sprintf("last error on add network err: %s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add network: %s", added.Name))
			addedCount++
			if importDevices {
				inst.bulkAddDevices(connUUID, hostUUID, added.UUID, added.Devices, importDevices)
			}
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, nil
}

func (inst *App) importDevicesBulk(connUUID, hostUUID, backupUUID, networkUUID string, addPoints bool) (*BulkAddResponse, error) {
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
		return nil, errors.New(fmt.Sprintf("no match for application: %s", application))
	}
	if backup.SubApplication != subApplication {
		return nil, errors.New(fmt.Sprintf("no match for subApplication: %s", subApplication))
	}
	b, err := json.Marshal(backup.Data)
	var devices []*model.Device
	if err := json.Unmarshal(b, &devices); err != nil {
		return nil, errors.New("failed to parse devices from backup")
	}
	return inst.bulkAddDevices(connUUID, hostUUID, networkUUID, devices, addPoints)
}

func (inst *App) importNetworksBulk(connUUID, hostUUID, backupUUID string, addDevices bool) (*BulkAddResponse, error) {
	backup, err := inst.getBackup(backupUUID)
	if err != nil {
		return nil, err
	}
	application := fmt.Sprintf("%s", logstore.FlowFramework)
	subApplication := fmt.Sprintf("%s", logstore.FlowFrameworkNetwork)
	if backup.Application != application {
		return nil, errors.New(fmt.Sprintf("no match for application: %s", application))
	}
	if backup.SubApplication != subApplication {
		return nil, errors.New(fmt.Sprintf("no match for subApplication: %s", subApplication))
	}
	b, err := json.Marshal(backup.Data)
	var networks []*model.Network
	if err := json.Unmarshal(b, &networks); err != nil {
		return nil, errors.New("failed to parse devices from backup")
	}
	return inst.bulkAddNetworks(connUUID, hostUUID, networks, addDevices)
}
