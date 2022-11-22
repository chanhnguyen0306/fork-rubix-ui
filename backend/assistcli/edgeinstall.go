package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/model"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"github.com/NubeIO/rubix-assist/service/systemctl"
)

func (inst *Client) EdgeAppUpload(hostIDName string, app *model.AppUpload) (*model.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/upload")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&model.Message{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.Message), nil
}

func (inst *Client) EdgeAppInstall(hostIDName string, app *systemctl.ServiceFile) (*model.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/install")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&model.Message{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.Message), nil
}

func (inst *Client) EdgeAppUninstall(hostIDName string, appName string) (*model.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/uninstall")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetQueryParam("app_name", appName).
		SetResult(&model.Message{}).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.Message), nil
}
