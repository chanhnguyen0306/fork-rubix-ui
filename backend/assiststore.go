package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"os"
	"path"
)

func (inst *App) assistAddUploadApp(assistClient *assistcli.Client, appName, version, arch string, doNotValidateArch bool) (*appstore.UploadResponse, bool, error) {
	if assistClient.CheckAppExistence(appName, arch, version) == nil {
		return nil, true, nil
	}
	err := inst.appStore.StoreCheckAppAndVersionExists(appName, arch, version)
	if err != nil {
		return nil, false, err
	}
	p := inst.appStore.GetAppStoreAppPath(appName, arch, version)
	buildDetails, err := builds.GetBuildZipNameByArch(p, arch, doNotValidateArch)
	if err != nil {
		return nil, false, err
	}
	if buildDetails == nil {
		return nil, false, errors.New(fmt.Sprintf("failed to match build zip name app: %s version: %s arch: %s", appName, version, arch))
	}

	fileName := buildDetails.ZipName
	fileAndPath := path.Join(p, fileName)
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, false, errors.New(fmt.Sprintf("error open file: %s err: %s", fileAndPath, err.Error()))
	}
	uploadApp, err := assistClient.UploadAddOnAppStore(appName, version, arch, fileName, reader)
	if err != nil {
		return nil, false, err
	}
	return uploadApp, false, err
}
