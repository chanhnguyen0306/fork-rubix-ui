package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
)

func (inst *Client) EdgeProductInfo(hostIDName string) (*amodel.Product, error) {
	url := fmt.Sprintf("/api/edge/system/product")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.Product{}).
		Get(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.Product), nil
}

func (inst *Client) EdgeSystemCtlAction(hostIDName, serviceName string, action amodel.Action) (*amodel.Message, error) {
	url := fmt.Sprintf("/proxy/edge/api/systemctl/%s?unit=%s", action, serviceName)
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

func (inst *Client) EdgeSystemCtlState(hostIDName, serviceName string) (*amodel.AppSystemState, error) {
	url := fmt.Sprintf("/proxy/edge/api/systemctl/state?unit=%s", serviceName)
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.AppSystemState{}).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.AppSystemState), nil
}
