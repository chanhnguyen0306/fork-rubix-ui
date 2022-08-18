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

func (inst *App) GetFlowPointSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	sch, err := inst.flow.PointSchema(pluginName)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return sch
}

func (inst *App) GetPoints(connUUID, hostUUID string) []model.Point {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := inst.flow.GetPoints()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}

func (inst *App) GetPointsForDevice(connUUID, hostUUID, deviceUUID string) []*model.Point {
	device, err := inst.getDevice(connUUID, hostUUID, deviceUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return device.Points
}

func (inst *App) addPoint(connUUID, hostUUID string, body *model.Point) (*model.Point, error) {
	if body.Name == "" {
		body.Name = fmt.Sprintf("point-%s", uuid.ShortUUID("")[5:10])
	}
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	point, err := inst.flow.AddPoint(body)
	if err != nil {
		return nil, err
	}
	return point, nil
}

func (inst *App) AddPoint(connUUID, hostUUID string, body *model.Point) *model.Point {
	point, err := inst.addPoint(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return point
}

func (inst *App) EditPoint(connUUID, hostUUID, pointUUID string, body *model.Point) *model.Point {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := inst.flow.EditPoint(pointUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}

func (inst *App) DeletePointBulk(connUUID, hostUUID string, pointUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, pnt := range pointUUIDs {
		msg := inst.DeletePoint(connUUID, hostUUID, pnt.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete point error: %s %s", pnt.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleted point: %s", pnt.Name))
		}
	}
	return "ok"
}

func (inst *App) DeletePoint(connUUID, hostUUID, pointUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeletePoint(pointUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) GetPoint(connUUID, hostUUID, pointUUID string) *model.Point {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	points, err := inst.flow.GetPoint(pointUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return points
}

type BulkAddResponse struct {
	Message    string `json:"message"`
	AddedCount int    `json:"added_count"`
	ErrorCount int    `json:"error_count"`
}

func (inst *App) ImportPointBulk(connUUID, hostUUID, backupUUID, deviceUUID string) *BulkAddResponse {
	resp, err := inst.importPointBulk(connUUID, hostUUID, backupUUID, deviceUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) importPointBulk(connUUID, hostUUID, backupUUID, deviceUUID string) (*BulkAddResponse, error) {
	if deviceUUID == "" {
		return nil, errors.New("device uuid cant not be empty")
	}
	backup, err := inst.getBackup(backupUUID)
	if err != nil {
		return nil, err
	}
	application := fmt.Sprintf("%s", logstore.FlowFramework)
	subApplication := fmt.Sprintf("%s", logstore.FlowFrameworkPoint)
	if backup.Application != application {
		return nil, errors.New(fmt.Sprintf("no match for application:%s", application))
	}
	if backup.SubApplication != subApplication {
		return nil, errors.New(fmt.Sprintf("no match for subApplication:%s", subApplication))
	}
	b, err := json.Marshal(backup.Data)
	var points []model.Point
	if err := json.Unmarshal(b, &points); err != nil {
		return nil, errors.New("failed to parse points from backup")
	}
	var message string
	var addedCount int
	var errorCount int
	for _, point := range points {
		point.DeviceUUID = deviceUUID
		newPnt, err := inst.addPoint(connUUID, hostUUID, &point)
		if err != nil {
			log.Errorf(fmt.Sprintf("add point err:%s", err.Error()))
			message = fmt.Sprintf("last error on add point err:%s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add point: %s", newPnt.Name))
			addedCount++
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, err
}

func (inst *App) ExportPointBulk(connUUID, hostUUID, userComment, deviceUUID string, pointUUIDs []string) *storage.Backup {
	resp, err := inst.exportPointBulk(connUUID, hostUUID, userComment, deviceUUID, pointUUIDs)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) exportPointBulk(connUUID, hostUUID, userComment, deviceUUID string, pointUUIDs []string) (*storage.Backup, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	var pointsList []model.Point
	var count int
	device, err := inst.getDevice(connUUID, hostUUID, deviceUUID, true)
	if err != nil {
		return nil, err
	}
	for _, uuid := range pointUUIDs {
		for _, point := range device.Points {
			if point.UUID == uuid {
				pointsList = append(pointsList, *point)
			}
			count++
		}
	}
	back := &storage.Backup{}
	back.ConnectionUUID = connUUID
	back.HostUUID = hostUUID
	back.Application = fmt.Sprintf("%s", logstore.FlowFramework)
	back.SubApplication = fmt.Sprintf("%s", logstore.FlowFrameworkPoint)
	back.UserComment = fmt.Sprintf("comment:%s device-name:%s", userComment, device.Name)
	back.Data = pointsList
	backup, err := inst.addBackup(back)
	if err != nil {
		return nil, err
	}
	return backup, nil
}
