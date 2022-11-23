package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
)

func (inst *Client) GetTransactions() (data []amodel.Transaction, response *Response) {
	path := fmt.Sprintf(Paths.Transactions.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&[]amodel.Transaction{}).
		Get(path)
	return *resp.Result().(*[]amodel.Transaction), response.buildResponse(resp, err)
}

func (inst *Client) GetTransaction(uuid string) (data *amodel.Transaction, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Transactions.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetResult(&amodel.Transaction{}).
		Get(path)
	return resp.Result().(*amodel.Transaction), response.buildResponse(resp, err)
}

func (inst *Client) AddTransaction(body *amodel.Transaction) (data *amodel.Transaction, response *Response) {
	path := fmt.Sprintf(Paths.Transactions.Path)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Transaction{}).
		Post(path)
	return resp.Result().(*amodel.Transaction), response.buildResponse(resp, err)
}

func (inst *Client) UpdateTransaction(uuid string, body *amodel.Transaction) (data *amodel.Transaction, response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Transactions.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		SetBody(body).
		SetResult(&amodel.Transaction{}).
		Patch(path)
	return resp.Result().(*amodel.Transaction), response.buildResponse(resp, err)
}

func (inst *Client) DeleteTransaction(uuid string) (response *Response) {
	path := fmt.Sprintf("%s/%s", Paths.Transactions.Path, uuid)
	response = &Response{}
	resp, err := inst.Rest.R().
		Delete(path)
	return response.buildResponse(resp, err)
}
