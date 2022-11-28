package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
)

func (inst *Client) GetTasks() (data []amodel.Task, response *Response) {
	path := fmt.Sprintf(Paths.Tasks.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&[]amodel.Task{}).
		Get(path)
	return *resp.Result().(*[]amodel.Task), response.buildResponse(resp, err)
}

func (inst *Client) GetTask(uuid string) (data *amodel.Task, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Tasks.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&amodel.Task{}).
		Get(path)
	return resp.Result().(*amodel.Task), response.buildResponse(resp, err)
}

func (inst *Client) AddTask(body *amodel.Task) (data *amodel.Task, response *Response) {
	path := fmt.Sprintf(Paths.Tasks.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Task{}).
		Post(path)
	return resp.Result().(*amodel.Task), response.buildResponse(resp, err)
}

func (inst *Client) UpdateTask(uuid string, body *amodel.Task) (data *amodel.Task, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Tasks.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Task{}).
		Patch(path)
	return resp.Result().(*amodel.Task), response.buildResponse(resp, err)
}

func (inst *Client) DeleteTask(uuid string) (response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Tasks.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		Delete(path)
	return response.buildResponse(resp, err)
}
