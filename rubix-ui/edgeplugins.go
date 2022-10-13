package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/model"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
)

func (inst *App) EdgeListPlugins(connUUID, hostUUID string) []appstore.Plugin {
	resp, err := inst.edgeListPlugins(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) *model.Message {
	resp, err := inst.edgeDeletePlugin(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeDeleteAllPlugins(connUUID, hostUUID string) *model.Message {
	resp, err := inst.edgeDeleteAllPlugins(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

// EdgeUpgradePlugins upgrade all the plugins
func (inst *App) EdgeUpgradePlugins(connUUID, hostUUID, releaseVersion string) (*assitcli.EdgeUploadResponse, error) {
	plugins, err := inst.edgeListPlugins(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	if len(plugins) == 0 {
		inst.crudMessage(false, fmt.Sprintf("there are no plugins to be upgraded"))
		return nil, err
	} else {
		_, err = inst.edgeDeleteAllPlugins(connUUID, hostUUID)
		if err != nil {
			return nil, err
		}
	}

	for _, plugin := range plugins {
		inst.crudMessage(true, fmt.Sprintf("start upgrade of plugin: %s", plugin.Name))
	}

	for _, plugin := range plugins {
		if plugin.Version == "" {
			plugin.Version = releaseVersion
		}
		inst.EdgeUploadPlugin(connUUID, hostUUID, &plugin, false)
	}
	_, err = inst.edgeRestartFlowFramework(connUUID, hostUUID)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func (inst *App) EdgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin, restartFlow bool) *assitcli.EdgeUploadResponse {
	var lastStep = "4"
	var hasPluginOnRubixAssist bool
	if body == nil {
		inst.crudMessage(false, fmt.Sprintf("plugin interface can not be empty"))
		return nil
	}
	if body.Name == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin name can not be empty"))
		return nil
	}
	if body.Arch == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin arch can not be empty"))
		return nil
	}
	if body.Version == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin version can not be empty"))
		return nil
	}

	inst.crudMessage(true, fmt.Sprintf("(step 1 of %s) check plugin is in downloads plugin: %s, version: %s, arch: %s", lastStep, body.Name, body.Version, body.Arch))
	_, checkPlugin, err := inst.storeGetPlugin(body)
	if checkPlugin == nil || err != nil {
		inst.crudMessage(false, fmt.Sprintf("failed to find plugin: %s, version: %s, arch: %s", body.Name, body.Version, body.Arch))
		return nil
	}
	plugins, err := inst.assistStoreListPlugins(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("assist check store for plugin: %s, err: %s", body.Name, err.Error()))
	}
	for _, plg := range plugins {
		if plg.Name == body.Name && plg.Arch == body.Arch && plg.Version == body.Version {
			hasPluginOnRubixAssist = true
		}
	}
	if hasPluginOnRubixAssist {
		inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) plugin found in assist-store", lastStep))
	} else {
		inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) try and upload plugin: %s to assist-store", lastStep, body.Name))
		plg, err := inst.assistStoreUploadPlugin(connUUID, body)
		if err != nil {
			inst.crudMessage(false, err.Error())
			return nil
		}
		inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) uploaded plugin to assist-store: %s", lastStep, plg.UploadedFile))
	}
	inst.crudMessage(true, fmt.Sprintf("(step 3 of %s) start to upload plugin: %s to edge device", lastStep, body.Name))
	resp, err := inst.edgeUploadPlugin(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, err.Error())
		return nil
	}
	if restartFlow {
		inst.crudMessage(true, fmt.Sprintf("(step 4 of %s) try and to restart flow-framework", lastStep))
		restart, err := inst.edgeRestartFlowFramework(connUUID, hostUUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("restart flow-framework err: %s", err.Error()))
		} else {
			inst.crudMessage(true, fmt.Sprintf("(step 4 of %s)  restart flow-framework msg: %s", lastStep, restart.Message))
		}
	}
	inst.crudMessage(true, fmt.Sprintf("completed upload to edge-device %s", body.Name))
	return resp
}

func (inst *App) edgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin) (*assitcli.EdgeUploadResponse, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.UploadPlugin(hostUUID, body)
}

func (inst *App) edgeListPlugins(connUUID, hostUUID string) ([]appstore.Plugin, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.ListPlugins(hostUUID)
}

func (inst *App) edgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) (*model.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.DeletePlugin(hostUUID, body)
}

func (inst *App) edgeDeleteAllPlugins(connUUID, hostUUID string) (*model.Message, error) {
	client, err := inst.initConnection(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	return client.DeleteAllPlugins(hostUUID)
}
