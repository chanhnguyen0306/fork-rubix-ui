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

type UUIDs struct {
	Name string `json:"name"`
	UUID string `json:"uuid"`
}

//func (inst *App) GetFlowNetworkSchema(connUUID, hostUUID, pluginName string) interface{} {
//	_, err := inst.resetHost(connUUID, hostUUID, true)
//	if err != nil {
//		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
//		return nil
//	}
//	sch, err := inst.flow.NetworkSchema(pluginName)
//	if err != nil {
//		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
//		return nil
//	}
//	return sch
//}

func (inst *App) DeleteNetworkBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := inst.DeleteNetwork(connUUID, hostUUID, net.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (inst *App) getNetworks(connUUID, hostUUID string, withDevice bool) ([]model.Network, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return []model.Network{}, err
	}
	networks, err := inst.flow.GetNetworks(withDevice)
	if err != nil {
		return []model.Network{}, err
	}
	return networks, nil
}

func (inst *App) GetNetworks(connUUID, hostUUID string, withDevice bool) []model.Network {
	networks, err := inst.getNetworks(connUUID, hostUUID, withDevice)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (inst *App) addNetwork(connUUID, hostUUID string, body *model.Network) (*model.Network, error) {
	if body.Name == "" {
		body.Name = fmt.Sprintf("%s", body.PluginPath)
	}
	networks, err := inst.EdgeAddNetwork(connUUID, hostUUID, body, true)
	return networks, err
}

func (inst *App) AddNetwork(connUUID, hostUUID string, body *model.Network) *model.Network {
	networks, err := inst.addNetwork(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (inst *App) ImportNetworksBulk(connUUID, hostUUID, backupUUID string) *BulkAddResponse {
	resp, err := inst.importNetworksBulk(connUUID, hostUUID, backupUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) importNetworksBulk(connUUID, hostUUID, backupUUID string) (*BulkAddResponse, error) {
	backup, err := inst.getBackup(backupUUID)
	if err != nil {
		return nil, err
	}
	application := fmt.Sprintf("%s", logstore.FlowFramework)
	subApplication := fmt.Sprintf("%s", logstore.FlowFrameworkNetwork)
	if backup.Application != application {
		return nil, errors.New(fmt.Sprintf("no match for application:%s", application))
	}
	if backup.SubApplication != subApplication {
		return nil, errors.New(fmt.Sprintf("no match for subApplication:%s", subApplication))
	}
	b, err := json.Marshal(backup.Data)
	var networks []model.Network
	if err := json.Unmarshal(b, &networks); err != nil {
		return nil, errors.New("failed to parse devices from backup")
	}
	var message string
	var addedCount int
	var errorCount int
	for _, net := range networks {
		newDev, err := inst.addNetwork(connUUID, hostUUID, &net)
		if err != nil {
			log.Errorf(fmt.Sprintf("add network err:%s", err.Error()))
			message = fmt.Sprintf("last error on add network err:%s", err.Error())
			errorCount++
		} else {
			log.Infof(fmt.Sprintf("add network: %s", newDev.Name))
			addedCount++
		}
	}
	return &BulkAddResponse{
		Message:    message,
		AddedCount: addedCount,
		ErrorCount: errorCount,
	}, err
}

func (inst *App) ExportNetworksBulk(connUUID, hostUUID, userComment string, deviceUUIDs []string) *storage.Backup {
	resp, err := inst.exportNetworksBulk(connUUID, hostUUID, userComment, deviceUUIDs)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) exportNetworksBulk(connUUID, hostUUID, userComment string, networkUUIDs []string) (*storage.Backup, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	var networkList []model.Network
	var count int
	network, err := inst.getNetworks(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	for _, uuid := range networkUUIDs {
		for _, net := range network {
			if net.UUID == uuid {
				networkList = append(networkList, net)
			}
			count++
		}
	}
	back := &storage.Backup{}
	back.ConnectionUUID = connUUID
	back.HostUUID = hostUUID
	back.Application = fmt.Sprintf("%s", logstore.FlowFramework)
	back.SubApplication = fmt.Sprintf("%s", logstore.FlowFrameworkNetwork)
	back.UserComment = fmt.Sprintf("comment:%s", userComment)
	back.Data = networkList
	backup, err := inst.addBackup(back)
	if err != nil {
		return nil, err
	}
	return backup, nil
}

//
//func (app *App) importNewNetwork(connUUID, hostUUID string, body *model.Network) {
//	devices := body.Devices
//	if devices != nil {
//		for _, device := range devices {
//			device.NetworkUUID = body.UUID
//			app.AddDevice(connUUID, hostUUID, device)
//			points := device.Points
//			for _, point := range points {
//				point.DeviceUUID = device.UUID
//				app.AddPoint(connUUID, hostUUID, point)
//			}
//		}
//	}
//}
//
//func (app *App) importEditNetwork(connUUID, hostUUID string, body *model.Network) {
//	devices := body.Devices
//	if devices != nil {
//		for _, device := range devices {
//			device.NetworkUUID = body.UUID
//			dev := app.EditDevice(connUUID, hostUUID, device.UUID, device)
//			if dev == nil { //device was not found so now try and add it
//				dev = app.AddDevice(connUUID, hostUUID, device)
//				if dev == nil { // device must exist with same name (this would happen from an older backup and then device was already remade, so it has a new uuid)
//					network, err := app.getNetwork(connUUID, hostUUID, device.NetworkUUID, true)
//					if err == nil {
//						for _, d := range network.Devices {
//							if d.Name == device.Name {
//								points := device.Points
//								for _, point := range points {
//									point.DeviceUUID = d.UUID // update the device uuid
//									app.AddPoint(connUUID, hostUUID, point)
//								}
//							}
//						}
//					}
//				} else {
//					points := device.Points
//					for _, point := range points {
//						point.DeviceUUID = device.UUID
//						app.AddPoint(connUUID, hostUUID, point)
//					}
//				}
//			} else { // device did exists
//				points := device.Points
//				for _, point := range points {
//					point.DeviceUUID = device.UUID
//					pnt := app.EditPoint(connUUID, hostUUID, point.UUID, point)
//					if pnt == nil { // point did not exist so now add it
//						app.AddPoint(connUUID, hostUUID, point)
//					}
//				}
//			}
//
//		}
//	}
//}
//
//// ImportNetwork to be used when user wants to import and make a new network or edit an existing network
//func (app *App) ImportNetwork(connUUID, hostUUID string, newImport, createAllChild bool, body *model.Network) *model.Network {
//	_, err := app.resetHost(connUUID, hostUUID, true)
//	if err != nil {
//		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
//		return nil
//	}
//	var net *model.Network
//	if newImport {
//		net = app.AddNetwork(connUUID, hostUUID, body)
//		if createAllChild {
//			app.importNewNetwork(connUUID, hostUUID, body)
//		}
//	} else {
//		net = app.EditNetwork(connUUID, hostUUID, body.UUID, body)
//		if createAllChild {
//			app.importEditNetwork(connUUID, hostUUID, body)
//		}
//	}
//	return net
//}

func (inst *App) EditNetwork(connUUID, hostUUID, networkUUID string, body *model.Network) *model.Network {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := inst.flow.EditNetwork(networkUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
func (inst *App) DeleteNetwork(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = inst.flow.DeleteNetwork(networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (inst *App) getNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.Network, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.GetNetwork(networkUUID, withDevice)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (inst *App) GetNetworkByPluginName(connUUID, hostUUID, networkName string, withDevice bool) *model.Network {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	network, err := inst.flow.GetNetworkByPluginName(networkName)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return network
}

type NetworksList struct {
	Name      string `json:"name"`
	PointUUID string `json:"point_uuid"`
}

func (inst *App) GetNetworksWithPointsDisplay(connUUID, hostUUID string) []NetworksList {
	list, err := inst.getNetworksWithPointsDisplay(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return list
}

func (inst *App) getNetworksWithPointsDisplay(connUUID, hostUUID string) ([]NetworksList, error) {
	networks, err := inst.getNetworksWithPoints(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	var networksLists []NetworksList
	var networksList NetworksList
	for _, network := range networks {
		for _, device := range network.Devices {
			for _, point := range device.Points {
				networksList.Name = fmt.Sprintf("%s:%s:%s", network.Name, device.Name, point.Name)
				networksList.PointUUID = point.UUID
				networksLists = append(networksLists, networksList)
			}
		}
	}
	return networksLists, nil
}

func (inst *App) GetNetworksWithPoints(connUUID, hostUUID string) []model.Network {
	networks, err := inst.getNetworksWithPoints(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (inst *App) GetNetworkWithPoints(connUUID, hostUUID, networkUUID string) *model.Network {
	networks, err := inst.getNetworkWithPoints(connUUID, hostUUID, networkUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (inst *App) getNetworkWithPoints(connUUID, hostUUID, networkUUID string) (*model.Network, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.GetNetworkWithPoints(networkUUID)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (inst *App) getNetworksWithPoints(connUUID, hostUUID string) ([]model.Network, error) {
	_, err := inst.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := inst.flow.GetNetworksWithPoints()
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (inst *App) GetNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) *model.Network {
	networks, err := inst.getNetwork(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

// GetNetworkBackupsByUUID get all backups for a network
func (inst *App) GetNetworkBackupsByUUID(application, subApplication, networkUUID string) []storage.Backup {
	data := inst.GetBackupsByApplication(application, subApplication, true)
	var backups []storage.Backup
	for _, back := range data {
		network, ok := back.Data.(*model.Network)
		if ok {
			if network.UUID == networkUUID {
				backups = append(backups, back)
			}
		}
	}
	return backups
}

// GetNetworkBackupsByPlugin get all backups for a network by its plugin
func (inst *App) GetNetworkBackupsByPlugin(application, subApplication, pluginName string) []storage.Backup {
	data := inst.GetBackupsByApplication(application, subApplication, true)
	var backups []storage.Backup
	for _, back := range data {
		network, ok := back.Data.(*model.Network)
		if ok {
			if network.PluginPath == pluginName {
				backups = append(backups, back)
			}
		}
	}
	return backups
}
