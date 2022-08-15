package main

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"github.com/NubeIO/rubix-assist/service/clients/edgecli"
)

func (inst *App) EdgeListPlugins(connUUID, hostUUID string) []appstore.Plugin {
	resp, err := inst.edgeListPlugins(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) *edgecli.Message {
	resp, err := inst.edgeDeletePlugin(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeDeleteAllPlugins(connUUID, hostUUID string) *edgecli.Message {
	resp, err := inst.edgeDeleteAllPlugins(connUUID, hostUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin, restartFlow bool) *assitcli.EdgeUploadResponse {
	var lastStep = "4"
	var matchedName bool
	var matchedArch bool
	var matchedVersion bool
	if body == nil {
		inst.crudMessage(false, fmt.Sprintf("plugin interface cant be empty"))
		return nil
	}
	if body.PluginName == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin name cant be empty"))
		return nil
	}
	if body.Arch == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin arch cant be empty"))
		return nil
	}
	if body.Version == "" {
		inst.crudMessage(false, fmt.Sprintf("plugin version cant be empty"))
		return nil
	}
	inst.crudMessage(false, fmt.Sprintf("(step 1 of %s) check plugin is in downloads plugin:%s version:%s arch:%s", lastStep, body.PluginName, body.Version, body.Arch))
	_, checkPlugin, err := inst.storeGetPlugin(body)
	if checkPlugin == nil || err != nil {
		inst.crudMessage(false, fmt.Sprintf("failed to find plugin:%s version:%s arch:%s", body.PluginName, body.Version, body.Arch))
		return nil
	}
	plugins, err := inst.assistStoreListPlugins(connUUID)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("assist check store for plugin:%s err:%s", body.PluginName, err.Error()))
	}
	for _, plg := range plugins {
		if plg.MatchedName == body.PluginName {
			matchedName = true
		}
		if plg.MatchedArch == body.Arch {
			matchedArch = true
		}
		if plg.MatchedVersion == body.Version {
			matchedVersion = true
		}
	}
	if matchedName && matchedArch && matchedVersion {
		inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) plugin found in assist-store", lastStep))
	} else {
		inst.crudMessage(true, fmt.Sprintf("(step 2 of %s) try and upload plugin:%s to assist-store", lastStep, body.PluginName))
		plg, err := inst.assistStoreUploadPlugin(connUUID, body)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
			return nil
		}
		inst.crudMessage(true, fmt.Sprintf(" uploaded plugin to assist-store:%s", plg.UploadedFile))
	}
	inst.crudMessage(true, fmt.Sprintf("(step 3 of %s) start to upload plugin:%s to edge device", lastStep, body.PluginName))
	resp, err := inst.edgeUploadPlugin(connUUID, hostUUID, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	if restartFlow {
		inst.crudMessage(true, fmt.Sprintf("(step 4 of %s) try and to restart flow-framework", lastStep))
		restart, err := inst.edgeRestartFlowFramework(connUUID, hostUUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("restart flow-framework err:%s", err.Error()))
		} else {
			inst.crudMessage(true, fmt.Sprintf("(step 4 of %s)  restart flow-framework msg:%s", lastStep, restart.Message))
		}
	}
	inst.crudMessage(true, fmt.Sprintf("competed upload to edge-device %s", body.PluginName))
	return resp
}

func (inst *App) edgeUploadPlugin(connUUID, hostUUID string, body *appstore.Plugin) (*assitcli.EdgeUploadResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeUploadPlugin(hostUUID, body)
}

func (inst *App) edgeListPlugins(connUUID, hostUUID string) ([]appstore.Plugin, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeListPlugins(hostUUID)
}

func (inst *App) edgeDeletePlugin(connUUID, hostUUID string, body *appstore.Plugin) (*edgecli.Message, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeletePlugin(hostUUID, body)
}

func (inst *App) edgeDeleteAllPlugins(connUUID, hostUUID string) (*edgecli.Message, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	return client.EdgeDeleteAllPlugins(hostUUID)
}
