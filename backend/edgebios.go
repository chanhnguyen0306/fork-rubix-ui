package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-ui/backend/constants"
	log "github.com/sirupsen/logrus"
)

func (inst *App) EdgeBiosRubixEdgeInstall(connUUID, hostUUID, version string) *string {
	err := inst.edgeBiosRubixEdgeInstall(connUUID, hostUUID, version)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
	}
	return nil
}

func (inst *App) edgeBiosRubixEdgeInstall(connUUID, hostUUID, version string) error {
	const appName = "rubix-edge"
	const lastStep = "5"
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return err
	}
	deviceType, err := client.EdgeBiosDeviceType(hostUUID)
	inst.uiSuccessMessage(fmt.Sprintf("(step 1 of %s) got edge device details: %s", lastStep, deviceType.DeviceType))
	if err != nil {
		return err
	}

	token, err := inst.GetGitToken(constants.SettingUUID, false)
	err = inst.appStore.StoreCheckAppAndVersionExists(appName, deviceType.DeviceType, version)
	if err != nil {
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) downloaded rubix-edge to local coz it doesn't exist", lastStep))
		log.Info(fmt.Sprintf("app: %s not found in appStore so download", appName))
		inst.downloadRubixEdge(token, appName, version, deviceType.DeviceType, true)
	} else {
		inst.uiSuccessMessage(fmt.Sprintf("(step 2 of %s) rubix-edge already exists", lastStep))
	}
	_, err = inst.assistAddUploadApp(connUUID, appName, version, deviceType.DeviceType, true)
	if err != nil {
		log.Errorf(fmt.Sprintf("(step 3 of %s) failed to upload rubix-edge to rubix-assist server", lastStep))
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 3 of %s) uploaded rubix-edge to rubix-assist server", lastStep))

	assistClient, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return err
	}
	_, err = assistClient.EdgeBiosRubixEdgeUpload(hostUUID, assistmodel.FileUpload{Arch: deviceType.DeviceType, Version: version})
	if err != nil {
		log.Errorf(fmt.Sprintf("(step 4 of %s) failed to upload rubix-edge to edge device", lastStep))
		return err
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 4 of %s) uploaded rubix-edge to edge device", lastStep))
	_, err = assistClient.EdgeBiosRubixEdgeInstall(hostUUID, assistmodel.FileUpload{Arch: deviceType.DeviceType, Version: version})
	if err != nil {
		log.Errorf(fmt.Sprintf("(step 5 of %s) failed to install rubix-edge to edge device", lastStep))
		return err
	}
	inst.uiSuccessMessage(fmt.Sprintf("(step 5 of %s) installed rubix-edge to edge device", lastStep))
	return nil
}

func (inst *App) downloadRubixEdge(token, appName, version, arch string, cleanDownload bool) error {
	log.Info(fmt.Sprintf("try to download app: %s version: %s", appName, version))
	_, err := inst.appStore.GitDownloadZip(token, appName, version, appName, arch, version, false, false, cleanDownload)
	if err != nil {
		return err
	}
	return nil
}
