package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/rumodel"
	"os"
)

func (inst *App) EdgeListPlugins(connUUID, hostUUID string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	plugins, connectionErr, requestErr := assistClient.EdgeListPlugins(hostUUID)
	if connectionErr != nil {
		return inst.fail(fmt.Sprintf("connection error: %s", connectionErr))
	}
	if requestErr != nil {
		return inst.fail(requestErr)
	}
	return inst.successResponse(plugins)
}

func (inst *App) EdgeUploadPlugins(connUUID, hostUUID string, plugins []string) []amodel.Message {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		inst.uiErrorMessage(err)
		return nil
	}

	var arch string
	resp, err := assistClient.EdgeBiosArch(hostUUID)
	if err != nil {
		inst.uiErrorMessage(err)
		inst.uiErrorMessage("turn on BIOS on your edge device")
		return nil
	}
	arch = resp.Arch

	appStatus, connectionErr, requestErr := assistClient.EdgeAppStatus(hostUUID, constants.FlowFramework)
	if connectionErr != nil {
		inst.uiErrorMessage(connectionErr)
		return nil
	}
	if requestErr != nil {
		inst.uiErrorMessage(requestErr)
	}

	for _, plugin := range plugins {
		if err := inst.edgeUploadPlugin(assistClient, hostUUID, &amodel.Plugin{
			Name:    plugin,
			Arch:    arch,
			Version: appStatus.Version,
		}); err != nil {
			return nil
		}
	}
	return nil
}

func (inst *App) edgeUploadPlugin(assistClient *assistcli.Client, hostUUID string, body *amodel.Plugin) error {
	var lastStep = "3"
	var hasPluginOnRubixAssist bool

	_, checkPlugin, err := inst.storeGetPluginPath(body)
	if checkPlugin == nil || err != nil {
		token, err := inst.GetGitToken(constants.SettingUUID, false)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("failed to get git token %s", err.Error()))
			return err
		}
		_, err = inst.appStore.DownloadFlowPlugin(token, body.Version, body.Name, body.Arch, true)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("(step 1 of %s) plugin doesn't exist and download also got failed (plugin: %s, version: %s, arch: %s)", lastStep, body.Name, body.Version, body.Arch))
			return err
		}
		inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) plugin didn't exist and it's downloaded (plugin: %s, version: %s, arch: %s)", lastStep, body.Name, body.Version, body.Arch))
	} else {
		inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) plugin already existed and download is skipped (plugin: %s, version: %s, arch: %s)", lastStep, body.Name, body.Version, body.Arch))
	}

	plugins, err := assistClient.StoreListPlugins()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("assist app store check for plugin: %s got error: %s", body.Name, err.Error()))
	}
	for _, plg := range plugins {
		if plg.Name == body.Name && plg.Arch == body.Arch && plg.Version == body.Version {
			hasPluginOnRubixAssist = true
		}
	}
	if hasPluginOnRubixAssist {
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) plugin %s already exists in rubix-assist", lastStep, body.Name))
	} else {
		absPath, flowPlugin, err := inst.storeGetPluginPath(body)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return err
		}
		f, err := os.Open(absPath)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return nil
		}
		plg, err := assistClient.StoreUploadPlugin(flowPlugin.ZipName, f)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return err
		}
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) uploaded plugin %s to rubix-assist", lastStep, plg.UploadedFile))
	}
	_, err = assistClient.EdgeUploadPlugin(hostUUID, body)
	if err != nil {
		inst.uiErrorMessage(err.Error())
		return err
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 3 of %s) uploaded plugin %s to edge device", lastStep, body.Name))
	return nil
}

func (inst *App) reAddEdgeUploadPlugins(assistClient *assistcli.Client, hostUUID, releaseVersion string) error {
	plugins, connectionErr, requestErr := assistClient.EdgeListPlugins(hostUUID)
	if connectionErr != nil {
		return connectionErr
	}
	if requestErr != nil {
		inst.uiWarningMessage(requestErr)
		return nil
	}
	if len(plugins) == 0 {
		inst.uiSuccessMessage(fmt.Sprintf("there are no plugins to be uploaded"))
		return nil
	}
	_, connectionErr, _ = assistClient.EdgeDeleteDownloadPlugins(hostUUID)
	if connectionErr != nil {
		return connectionErr
	}
	for _, plugin := range plugins {
		inst.uiSuccessMessage(fmt.Sprintf("start uploading of plugin: %s", plugin.Name))
		plugin.Version = releaseVersion
		if err := inst.edgeUploadPlugin(assistClient, hostUUID, &plugin); err != nil {
			return err
		}
	}
	return nil
}
