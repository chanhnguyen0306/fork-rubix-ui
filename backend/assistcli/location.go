package assistcli

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
)

func (inst *Client) GetLocations() (data []amodel.Location, response *Response) {
	path := fmt.Sprintf(Paths.Location.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&[]amodel.Location{}).
		Get(path)
	return *resp.Result().(*[]amodel.Location), response.buildResponse(resp, err)
}

func (inst *Client) GetLocation(uuid string) (data *amodel.Location, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Location.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&amodel.Location{}).
		Get(path)
	return resp.Result().(*amodel.Location), response.buildResponse(resp, err)
}

func (inst *Client) AddLocation(body *amodel.Location) (data *amodel.Location, response *Response) {
	path := fmt.Sprintf(Paths.Location.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Location{}).
		Post(path)
	return resp.Result().(*amodel.Location), response.buildResponse(resp, err)
}

func (inst *Client) UpdateLocation(uuid string, body *amodel.Location) (data *amodel.Location, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Location.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Location{}).
		Patch(path)
	return resp.Result().(*amodel.Location), response.buildResponse(resp, err)
}

func (inst *Client) DeleteLocation(uuid string) (response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Location.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		Delete(path)
	return response.buildResponse(resp, err)
}

func (inst *Client) GetLocationSchema() (data interface{}, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Location.Path, "schema")
	response = &Response{}
	resp, err := inst.Rest.R().
		Get(path)
	var result interface{}
	err = json.Unmarshal(resp.Body(), &result)
	return result, response.buildResponse(resp, err)
}
