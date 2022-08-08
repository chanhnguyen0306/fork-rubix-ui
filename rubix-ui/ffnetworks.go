package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

type UUIDs struct {
	Name string `json:"name"`
	UUID string `json:"uuid"`
}

func (app *App) GetFlowNetworkSchema(connUUID, hostUUID, pluginName string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	sch, err := app.flow.NetworkSchema(pluginName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return sch
}

func (app *App) DeleteNetworkBulk(connUUID, hostUUID string, networkUUIDs []UUIDs) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	for _, net := range networkUUIDs {
		msg := app.DeleteNetwork(connUUID, hostUUID, net.UUID)
		if err != nil {
			app.crudMessage(false, fmt.Sprintf("delete network %s %s", net.Name, msg))
		} else {
			app.crudMessage(true, fmt.Sprintf("deleteed network: %s", net.Name))
		}
	}
	return "ok"
}

func (app *App) GetNetworks(connUUID, hostUUID string, withDevice bool) []model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Network{}
	}
	networks, err := app.flow.GetNetworks(withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []model.Network{}
	}
	return networks
}

func (app *App) AddNetwork(connUUID, hostUUID string, body *model.Network) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.AddNetwork(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (app *App) importNewNetwork(connUUID, hostUUID string, body *model.Network) {
	devices := body.Devices
	if devices != nil {
		for _, device := range devices {
			device.NetworkUUID = body.UUID
			app.AddDevice(connUUID, hostUUID, device)
			points := device.Points
			for _, point := range points {
				point.DeviceUUID = device.UUID
				app.AddPoint(connUUID, hostUUID, point)
			}
		}
	}
}

func (app *App) importEditNetwork(connUUID, hostUUID string, body *model.Network) {
	devices := body.Devices
	if devices != nil {
		for _, device := range devices {
			device.NetworkUUID = body.UUID
			dev := app.EditDevice(connUUID, hostUUID, device.UUID, device)
			if dev == nil { //device was not found so now try and add it
				dev = app.AddDevice(connUUID, hostUUID, device)
				if dev == nil { // device must exist with same name (this would happen from an older backup and then device was already remade, so it has a new uuid)
					network, err := app.getNetwork(connUUID, hostUUID, device.NetworkUUID, true)
					if err == nil {
						for _, d := range network.Devices {
							if d.Name == device.Name {
								points := device.Points
								for _, point := range points {
									point.DeviceUUID = d.UUID // update the device uuid
									app.AddPoint(connUUID, hostUUID, point)
								}
							}
						}
					}
				} else {
					points := device.Points
					for _, point := range points {
						point.DeviceUUID = device.UUID
						app.AddPoint(connUUID, hostUUID, point)
					}
				}
			} else { // device did exists
				points := device.Points
				for _, point := range points {
					point.DeviceUUID = device.UUID
					pnt := app.EditPoint(connUUID, hostUUID, point.UUID, point)
					if pnt == nil { // point did not exist so now add it
						app.AddPoint(connUUID, hostUUID, point)
					}
				}
			}

		}
	}
}

// ImportNetwork to be used when user wants to import and make a new network or edit an existing network
func (app *App) ImportNetwork(connUUID, hostUUID string, newImport, createAllChild bool, body *model.Network) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	var net *model.Network
	if newImport {
		net = app.AddNetwork(connUUID, hostUUID, body)
		if createAllChild {
			app.importNewNetwork(connUUID, hostUUID, body)
		}
	} else {
		net = app.EditNetwork(connUUID, hostUUID, body.UUID, body)
		if createAllChild {
			app.importEditNetwork(connUUID, hostUUID, body)
		}
	}
	return net
}

func (app *App) EditNetwork(connUUID, hostUUID, networkUUID string, body *model.Network) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.EditNetwork(networkUUID, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}
func (app *App) DeleteNetwork(connUUID, hostUUID, networkUUID string) interface{} {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	_, err = app.flow.DeleteNetwork(networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return err
	}
	return "delete ok"
}

func (app *App) getNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) (*model.Network, error) {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		return nil, err
	}
	networks, err := app.flow.GetNetwork(networkUUID, withDevice)
	if err != nil {
		return nil, err
	}
	return networks, nil
}

func (app *App) GetNetworkByPluginName(connUUID, hostUUID, networkName string, withDevice bool) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	network, err := app.flow.GetNetworkByPluginName(networkName)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return network
}

func (app *App) GetNetworkWithPoints(connUUID, hostUUID, networkUUID string) *model.Network {
	_, err := app.resetHost(connUUID, hostUUID, true)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	networks, err := app.flow.GetNetworkWithPoints(networkUUID)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

func (app *App) GetNetwork(connUUID, hostUUID, networkUUID string, withDevice bool) *model.Network {
	networks, err := app.getNetwork(connUUID, hostUUID, networkUUID, withDevice)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return networks
}

// GetNetworkBackupsByUUID get all backups for a network
func (app *App) GetNetworkBackupsByUUID(application, subApplication, networkUUID string) []storage.Backup {
	data := app.GetBackupsByApplication(application, subApplication, true)
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
func (app *App) GetNetworkBackupsByPlugin(application, subApplication, pluginName string) []storage.Backup {
	data := app.GetBackupsByApplication(application, subApplication, true)
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
