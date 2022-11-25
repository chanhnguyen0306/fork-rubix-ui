package assistcli

import (
	"fmt"
	"github.com/NubeIO/lib-systemctl-go/systemd"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"github.com/NubeIO/rubix-assist/service/systemctl"
	"strconv"
)

// EdgeUploadApp upload an app to the edge device
func (inst *Client) EdgeUploadApp(hostIDName string, app *amodel.Upload) (*amodel.AppResponse, error) {
	url := fmt.Sprintf("/api/edge/apps/upload")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.AppResponse{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.AppResponse), nil
}

// EdgeUploadService generate a service file and upload it to edge device
func (inst *Client) EdgeUploadService(hostIDName string, app *systemctl.ServiceFile) (*appstore.UploadResponse, error) {
	url := fmt.Sprintf("/api/edge/apps/service/upload")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&appstore.UploadResponse{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*appstore.UploadResponse), nil
}

// InstallEdgeService this assumes that the service file and app already exists on the edge device
func (inst *Client) InstallEdgeService(hostIDName string, body *amodel.Install) (*systemd.InstallResponse, error) {
	url := fmt.Sprintf("/api/edge/apps/service/install")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&systemd.InstallResponse{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*systemd.InstallResponse), nil
}

// EdgeUninstallApp remove/delete an app and its service
func (inst *Client) EdgeUninstallApp(hostIDName, appName string, deleteApp bool) (*systemd.UninstallResponse, error) {
	url := fmt.Sprintf("/api/edge/apps?name=%s&delete=%s", appName, strconv.FormatBool(deleteApp))
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&systemd.UninstallResponse{}).
		Delete(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*systemd.UninstallResponse), nil
}

// EdgeListApps apps by listed in the installation (/data/rubix-service/apps/install)
func (inst *Client) EdgeListApps(hostIDName string) ([]amodel.Apps, error) {
	url := fmt.Sprintf("/api/edge/apps")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&[]amodel.Apps{}).
		Get(url))
	if err != nil {
		return nil, err
	}
	data := resp.Result().(*[]amodel.Apps)
	return *data, nil
}

// EdgeListAppsStatus get all the apps with its status
func (inst *Client) EdgeListAppsStatus(hostIDName string) ([]amodel.AppsStatus, error) {
	url := fmt.Sprintf("/api/edge/apps/status")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&[]amodel.AppsStatus{}).
		Get(url))
	if err != nil {
		return nil, err
	}
	data := resp.Result().(*[]amodel.AppsStatus)
	return *data, nil
}
