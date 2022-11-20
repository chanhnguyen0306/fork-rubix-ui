package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/model"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"github.com/NubeIO/rubix-ui/backend/constants"
)

// EdgeProductInfo get edge product info
func (inst *Client) EdgeProductInfo(hostIDName string) (*model.Product, error) {
	url := fmt.Sprintf("/api/edge/system/product")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&model.Product{}).
		Get(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.Product), nil
}

func (inst *Client) EdgeSystemCtlAction(hostIDName string, body *model.SystemCtlBody) (*model.SystemResponse, error) {
	url := fmt.Sprintf("/api/edge/control/action")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&model.SystemResponse{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.SystemResponse), nil
}

func (inst *Client) EdgeServiceMassAction(hostIDName string, body *model.SystemCtlBody) ([]model.MassSystemResponse, error) {
	url := fmt.Sprintf("/api/edge/control/action/mass")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&[]model.MassSystemResponse{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	data := resp.Result().(*[]model.MassSystemResponse)
	return *data, nil
}

func (inst *Client) EdgeSystemCtlStatus(hostIDName string, body *model.SystemCtlBody) (*model.AppSystemState, error) {
	url := fmt.Sprintf("/api/edge/control/status")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&model.AppSystemState{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*model.AppSystemState), nil
}

func (inst *Client) EdgeServiceMassStatus(hostIDName string, body *model.SystemCtlBody) ([]model.AppSystemState, error) {
	url := fmt.Sprintf("/api/edge/control/status/mass")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&[]model.AppSystemState{}).
		SetBody(body).
		Post(url))
	if err != nil {
		return nil, err
	}
	data := resp.Result().(*[]model.AppSystemState)
	return *data, nil
}

func (inst *Client) EdgeSystemRestartFlowFramework(hostIDName string) (*model.SystemResponse, error) {
	return inst.EdgeSystemCtlAction(hostIDName, &model.SystemCtlBody{
		ServiceName: constants.FlowFrameworkService,
		Action:      "restart",
	})
}
