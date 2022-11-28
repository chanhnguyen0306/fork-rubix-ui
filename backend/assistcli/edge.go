package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
)

func (inst *Client) EdgeAppStatus(hostIDName, appName string) (*amodel.AppsStatus, error) {
	url := fmt.Sprintf("/api/edge/apps/status/%s", appName)
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetHeader("host_uuid", hostIDName).
		SetHeader("host_name", hostIDName).
		SetResult(&amodel.AppsStatus{}).
		Get(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*amodel.AppsStatus), nil
}
