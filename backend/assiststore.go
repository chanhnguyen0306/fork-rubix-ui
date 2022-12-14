package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-ui/backend/assistcli"
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"github.com/NubeIO/rubix-ui/backend/store"
	"os"
	"path"
)

func (inst *App) assistAddUploadApp(assistClient *assistcli.Client, app store.App, doNotValidateArch bool) (
	*appstore.UploadResponse, bool, error) {
	if assistClient.CheckAppExistence(app.Name, app.Version, app.Arch) == nil {
		return nil, true, nil
	}
	err := inst.appStore.StoreCheckAppAndVersionExists(app)
	if err != nil {
		return nil, false, err
	}
	p := inst.appStore.GetAppStoreAppPath(app)
	buildDetails, err := builds.GetBuildZipNameByArch(p, app.Arch, doNotValidateArch)
	if err != nil {
		return nil, false, err
	}
	if buildDetails == nil {
		return nil, false, errors.New(fmt.Sprintf("failed to match build zip name app: %s version: %s arch: %s",
			app.Name, app.Version, app.Arch))
	}

	fileName := buildDetails.ZipName
	fileAndPath := path.Join(p, fileName)
	reader, err := os.Open(fileAndPath)
	if err != nil {
		return nil, false, errors.New(fmt.Sprintf("error open file: %s err: %s", fileAndPath, err.Error()))
	}
	uploadApp, err := assistClient.UploadAppOnAppStore(app.Name, app.Version, app.Arch, fileName, reader)
	if err != nil {
		return nil, false, err
	}
	return uploadApp, false, err
}
