package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
)

type EdgeUploadResponse struct {
	Destination string `json:"destination"`
	File        string `json:"file"`
	Size        string `json:"size"`
	UploadTime  string `json:"upload_time"`
}

func (inst *Client) EdgeListPlugins(hostIDName string) ([]amodel.Plugin, error, error) {
	url := fmt.Sprintf("/api/edge/plugins")
	resp, connectionErr, requestErr := nresty.FormatRestyV2Response(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&[]amodel.Plugin{}).
		Get(url))
	if connectionErr != nil || requestErr != nil {
		return nil, connectionErr, requestErr
	}
	data := resp.Result().(*[]amodel.Plugin)
	return *data, nil, nil
}

func (inst *Client) EdgeUploadPlugin(hostIDName string, body *amodel.Plugin) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/plugins/upload")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}

func (inst *Client) EdgeMoveFromDownloadToInstallPlugins(hostIDName string) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/plugins/move-from-download-to-install")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}

func (inst *Client) EdgeDeletePlugin(hostIDName, pluginName, arch string) (*amodel.Message, error) {
	url := fmt.Sprintf("/api/edge/plugins/name/%s?arch=%s", pluginName, arch)
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		Delete(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Message), nil
}

func (inst *Client) EdgeDeleteDownloadPlugins(hostIDName string) (*amodel.Message, error, error) {
	url := fmt.Sprintf("/api/edge/plugins/download-plugins")
	// we use v2 here, coz it shows requestErr when there is no plugins' directory on download path
	resp, connectionErr, requestErr := nresty.FormatRestyV2Response(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Message{}).
		Delete(url))
	if connectionErr != nil || requestErr != nil {
		return nil, connectionErr, requestErr
	}
	return resp.Result().(*amodel.Message), nil, nil
}
