package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"github.com/NubeIO/rubix-assist/service/systemctl"
)

func (inst *Client) EdgeAppUpload(hostIDName string, app *amodel.AppUpload) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/upload")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}

func (inst *Client) EdgeAppInstall(hostIDName string, app *systemctl.ServiceFile) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/install")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		SetBody(app).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}

func (inst *Client) EdgeAppUninstall(hostIDName string, appName string) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/apps/uninstall")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetQueryParam("app_name", appName).
		SetResult(&amodel.Message{}).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}
