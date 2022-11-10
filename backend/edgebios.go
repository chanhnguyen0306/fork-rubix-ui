package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/pkg/assistmodel"
	"github.com/NubeIO/rubix-ui/backend/constants"
	log "github.com/sirupsen/logrus"
)

func (inst *App) EdgeBiosRubixEdgeInstall(connUUID, hostUUID string) *string {
	err := inst.edgeBiosRubixEdgeInstall(connUUID, hostUUID)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
	}
	return nil
}

func (inst *App) edgeBiosRubixEdgeInstall(connUUID, hostUUID string) error {
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
	// githubToken, err := inst.DB.GetGitToken(constants.SettingUUID, false)
	// if err != nil {
	// 	return err
	// }
	// versions := inst.appStore.GetRubixEdgeVersions(githubToken)
	// fmt.Println("versions", versions)

	version := "v0.3.2" // TODO: get version from UI

	fmt.Println("version", version)
	fmt.Println("deviceType", deviceType.DeviceType)
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
		return err
	}
	_, err = assistClient.EdgeBiosRubixEdgeInstall(hostUUID, assistmodel.FileUpload{Arch: deviceType.DeviceType, Version: version})
	if err != nil {
		return err
	}
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
