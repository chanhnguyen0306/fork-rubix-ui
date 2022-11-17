package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"os"
)

func (inst *App) edgeUpgradePlugins(assistCli *assistcli.Client, hostUUID, releaseVersion string) error {
	plugins, err := assistCli.ListPlugins(hostUUID)
	if err != nil {
		return err
	}
	if len(plugins) == 0 {
		inst.uiSuccessMessage(fmt.Sprintf("there are no plugins to be upgraded"))
		return err
	} else {
		_, err = assistCli.DeleteAllPlugins(hostUUID) // TODO: too risky to delete before completing it...
		if err != nil {
			return err
		}
	}

	for _, plugin := range plugins {
		inst.uiSuccessMessage(fmt.Sprintf("start upgrade of plugin: %s", plugin.Name))
		plugin.Version = releaseVersion
		inst.EdgeUploadPlugin(assistCli, hostUUID, &plugin, false)
	}
	return nil
}

func (inst *App) EdgeUploadPlugin(assistClient *assistcli.Client, hostUUID string, body *appstore.Plugin, restartFlow bool) *assistcli.EdgeUploadResponse {
	var lastStep = "4"
	var hasPluginOnRubixAssist bool
	if body == nil {
		inst.uiErrorMessage(fmt.Sprintf("plugin interface can not be empty"))
		return nil
	}
	if body.Name == "" {
		inst.uiErrorMessage(fmt.Sprintf("plugin name can not be empty"))
		return nil
	}
	if body.Arch == "" {
		inst.uiErrorMessage(fmt.Sprintf("plugin arch can not be empty"))
		return nil
	}
	if body.Version == "" {
		inst.uiErrorMessage(fmt.Sprintf("plugin version can not be empty"))
		return nil
	}

	_, checkPlugin, err := inst.storeGetPluginPath(body)
	if checkPlugin == nil || err != nil {
		token, err := inst.GetGitToken(constants.SettingUUID, false)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("failed to get git token %s", err.Error()))
			return nil
		}
		_, err = inst.appStore.DownloadFlowPlugin(token, body.Version, body.Name, body.Arch, true)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("(step 1 of %s) plugin doesn't exist and download also got failed (plugin: %s, version: %s, arch: %s)", lastStep, body.Name, body.Version, body.Arch))
			return nil
		}
		inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) plugin didn't exist and it's downloaded (plugin: %s, version: %s, arch: %s)", lastStep, body.Name, body.Version, body.Arch))
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
			return nil
		}
		f, err := os.Open(absPath)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return nil
		}
		plg, err := assistClient.StoreUploadPlugin(flowPlugin.ZipName, f)
		if err != nil {
			inst.uiErrorMessage(err.Error())
			return nil
		}
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) uploaded plugin %s to rubix-assist", lastStep, plg.UploadedFile))
	}
	resp, err := assistClient.UploadPlugin(hostUUID, body)
	if err != nil {
		inst.uiErrorMessage(err.Error())
		return nil
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 3 of %s) uploaded plugin %s to edge device", lastStep, body.Name))
	if restartFlow {
		inst.uiSuccessMessage(fmt.Sprintf("(step 4 of %s) try and to restart flow-framework", lastStep))
		_, err = assistClient.EdgeSystemRestartFlowFramework(hostUUID)
		if err != nil {
			inst.uiErrorMessage(fmt.Sprintf("(step 4 of %s) restarted flow-framework error: %s", lastStep, err.Error()))
		} else {
			inst.uiSuccessMessage(fmt.Sprintf("(step 4 of %s) restarted flow-framework successfully", lastStep))
		}
	}
	return resp
}
