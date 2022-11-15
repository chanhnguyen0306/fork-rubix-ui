package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"os"
	"path"
)

func (inst *App) assistListStore(connUUID string) ([]appstore.ListApps, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.ListAppsWithVersions()
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) assistAddUploadApp(assistClient *assistcli.Client, appName, version, arch string, doNotValidateArch bool) (*appstore.UploadResponse, error) {
	err := inst.appStore.StoreCheckAppExists(appName)
	if err != nil {
		return nil, err
	}
	err = inst.appStore.StoreCheckAppAndVersionExists(appName, arch, version)
	if err != nil {
		return nil, err
	}
	p := inst.appStore.GetAppStoreAppPath(appName, arch, version)
	buildDetails, err := inst.App.GetBuildZipNameByArch(p, arch, doNotValidateArch)
	if err != nil {
		return nil, err
	}
	if buildDetails == nil {
		return nil, errors.New(fmt.Sprintf("failed to match build zip name app: %s version: %s arch: %s", appName, version, arch))
	}

	fileName := buildDetails.ZipName
	fileAndPath := path.Join(p, fileName)
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file: %s err: %s", fileAndPath, err.Error()))
	}
	uploadApp, err := assistClient.UploadAddOnAppStore(appName, version, arch, fileName, reader)
	if err != nil {
		return nil, err
	}
	return uploadApp, err
}

func (inst *App) assistStoreListPlugins(connUUID string) ([]installer.BuildDetails, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreListPlugins()
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (inst *App) assistStoreUploadPlugin(connUUID string, body *appstore.Plugin) (*appstore.UploadResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	f, flowPlugin, err := inst.storeGetPlugin(body)
	if err != nil {
		return nil, err
	}
	resp, err := client.StoreUploadPlugin(flowPlugin.ZipName, f)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
