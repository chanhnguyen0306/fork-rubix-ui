package backend

import (
	"context"
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/NubeIO/rubix-ui/backend/rumodel"
	"github.com/google/go-github/v32/github"
	"golang.org/x/oauth2"
	"os"
	"strings"
)

func (inst *App) EdgeGetPluginsDistribution(connUUID, hostUUID string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}

	var arch string
	resp, err := assistClient.EdgeBiosArch(hostUUID)
	if err != nil {
		return inst.fail(fmt.Sprintf("%s, turn on BIOS on your edge device", err))
	}
	arch = resp.Arch

	version, err := inst.getFlowFrameworkVersion(assistClient, hostUUID)
	if err != nil {
		return inst.fail(err)
	}

	plugins, connectionErr, requestErr := assistClient.EdgeListPlugins(hostUUID)
	if connectionErr != nil {
		return inst.fail(err)
	}
	if requestErr != nil {
		inst.uiWarningMessage(requestErr)
	}

	token, err := inst.GetGitToken(constants.SettingUUID, false)
	if err != nil {
		return inst.fail(fmt.Sprintf("failed to get git token %s", err))
	}
	c := context.Background()
	tokenSource := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	githubClient := github.NewClient(oauth2.NewClient(c, tokenSource))

	availablePlugins := make([]rumodel.AvailablePlugin, 0)
	releases, _, err := githubClient.Repositories.GetReleaseByTag(c, constants.GitHubOwner, constants.FlowFramework, *version)
	for _, asset := range releases.Assets {
		if asset.Name != nil && strings.Contains(*asset.Name, arch) && !strings.Contains(*asset.Name, constants.FlowFramework) {
			pluginName := strings.Split(*asset.Name, "-")[0]
			isInstalled := false
			if plugins != nil {
				for _, plugin := range plugins {
					if plugin.Name == pluginName {
						isInstalled = true
					}
				}
			}
			availablePlugins = append(availablePlugins, rumodel.AvailablePlugin{
				Name:        pluginName,
				IsInstalled: isInstalled,
			})
		}
	}
	return inst.successResponse(availablePlugins)
}

func (inst *App) EdgeGetPlugins(connUUID, hostUUID string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	plugins, err := assistClient.EdgeGetPlugins(hostUUID)
	if err != nil {
		return inst.fail(err)
	}
	return inst.successResponse(plugins)
}

func (inst *App) EdgeInstallPlugin(connUUID, hostUUID string, pluginName string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}

	var arch string
	resp, err := assistClient.EdgeBiosArch(hostUUID)
	if err != nil {
		return inst.fail(fmt.Sprintf("%s, turn on BIOS on your edge device", err))
	}
	arch = resp.Arch

	appStatus, connectionErr, requestErr := assistClient.EdgeAppStatus(hostUUID, constants.FlowFramework)
	if connectionErr != nil {
		return inst.fail(connectionErr)
	}
	if requestErr != nil {
		return inst.fail(requestErr)
	}

	_, connectionErr, _ = assistClient.EdgeDeleteDownloadPlugins(hostUUID)
	if connectionErr != nil {
		return inst.fail(connectionErr)
	}

	if err := inst.edgeUploadPlugin(assistClient, hostUUID, &amodel.Plugin{
		Name:    pluginName,
		Arch:    arch,
		Version: appStatus.Version,
	}); err != nil {
		return inst.fail(err)
	}

	if _, err = assistClient.EdgeMoveFromDownloadToInstallPlugins(hostUUID); err != nil {
		return inst.fail(err)
	}

	if err = inst.restartFlowFramework(assistClient, hostUUID); err != nil {
		inst.fail(err)
	}
	return inst.success(fmt.Sprintf("successfully installed plugin %s", pluginName))
}

func (inst *App) EdgeUninstallPlugin(connUUID, hostUUID string, pluginName string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}

	var arch string
	resp, err := assistClient.EdgeBiosArch(hostUUID)
	if err != nil {
		return inst.fail(fmt.Sprintf("%s, turn on BIOS on your edge device", err))
	}
	arch = resp.Arch

	msg, err := assistClient.EdgeDeletePlugin(hostUUID, pluginName, arch)
	if err != nil {
		return inst.fail(err)
	}

	if err = inst.restartFlowFramework(assistClient, hostUUID); err != nil {
		inst.fail(err)
	}
	return inst.success(msg.Message)
}

func (inst *App) EdgeGetConfigPlugin(connUUID, hostUUID, pluginName string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	conf, err := assistClient.EdgeGetConfigPlugin(hostUUID, pluginName)
	if err != nil {
		return inst.fail(err)
	}
	return inst.successResponse(conf)
}

func (inst *App) EdgeUpdateConfigPlugin(connUUID, hostUUID, pluginName, config string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	_, err = assistClient.EdgeUpdateConfigPlugin(hostUUID, pluginName, config)
	if err != nil {
		return inst.fail(err)
	}
	if err = inst.restartFlowFramework(assistClient, hostUUID); err != nil {
		inst.fail(err)
	}
	return inst.success("updated config successfully")
}

func (inst *App) EdgeEnablePlugins(connUUID, hostUUID string, pluginNames []string, enable bool) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	for _, pluginName := range pluginNames {
		_, _ = assistClient.EdgeEnablePlugin(hostUUID, pluginName, enable)
	}
	state := "enabled"
	if enable == false {
		state = "disabled"
	}
	output := fmt.Sprintf("selected plugins are %s successfully", state)
	return inst.success(output)
}

func (inst *App) EdgeRestartPlugins(connUUID, hostUUID string, pluginNames []string) *rumodel.Response {
	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return inst.fail(err)
	}
	for _, pluginName := range pluginNames {
		_, _ = assistClient.EdgeRestartPlugin(hostUUID, pluginName)
	}
	output := fmt.Sprintf("selected plugins are restarted successfully")
	return inst.success(output)
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

func (inst *App) reAddEdgeUploadPlugins(assistClient *assistcli.Client, hostUUID, releaseVersion, arch string) error {
	plugins, err := assistClient.EdgeGetPlugins(hostUUID)
	if err != nil {
		return err
	}
	if len(plugins) == 0 {
		inst.uiSuccessMessage(fmt.Sprintf("there are no plugins to be uploaded"))
		return nil
	}
	_, connectionErr, _ := assistClient.EdgeDeleteDownloadPlugins(hostUUID)
	if connectionErr != nil {
		return connectionErr
	}
	for _, plugin := range plugins {
		inst.uiSuccessMessage(fmt.Sprintf("start uploading of plugin: %s", plugin.Name))
		if err := inst.edgeUploadPlugin(assistClient, hostUUID, &amodel.Plugin{
			Name:    plugin.Name,
			Arch:    arch,
			Version: releaseVersion,
		}); err != nil {
			return err
		}
	}
	return nil
}

func (inst *App) edgeEnablePlugin(assistClient *assistcli.Client, hostUUID string, pluginName string, enable bool) (*string, error) {
	resp, err := assistClient.EdgeEnablePlugin(hostUUID, pluginName, enable)
	if err != nil {
		return nil, err
	}
	if err = inst.restartFlowFramework(assistClient, hostUUID); err != nil {
		return nil, err
	}
	return resp, nil
}
