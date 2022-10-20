package flowcli

import (
	"fmt"
	"github.com/NubeDev/flow-eng/db"
	"github.com/NubeDev/flow-eng/node"
	"github.com/NubeDev/flow-eng/services/clients/ffclient/nresty"
)

func (inst *FlowClient) AddConnection(body *db.Connection) (*db.Connection, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&db.Connection{}).
		SetBody(body).
		Post("/api/connections"))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*db.Connection), nil
}

func (inst *FlowClient) GetConnections() ([]db.Connection, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&[]db.Connection{}).
		Get("/api/connections"))
	if err != nil {
		return nil, err
	}
	var out []db.Connection
	out = *resp.Result().(*[]db.Connection)
	return out, nil
}

func (inst *FlowClient) GetConnection(uuid string) (*db.Connection, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&db.Connection{}).
		Get(fmt.Sprintf("/api/connections/%s", uuid)))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*db.Connection), nil
}

func (inst *FlowClient) DeleteConnection(uuid string) error {
	_, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&node.Values{}).
		Delete(fmt.Sprintf("/api/connections/%s", uuid)))
	if err != nil {
		return err
	}
	return nil
}

func (inst *FlowClient) UpdateConnection(uuid string, body *db.Connection) (*db.Connection, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&db.Connection{}).
		SetBody(body).
		Patch(fmt.Sprintf("/api/connections/%s", uuid)))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*db.Connection), nil
}
