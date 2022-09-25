package flowcli

import (
	"fmt"
	"github.com/NubeDev/flow-eng/node"
	"github.com/NubeDev/flow-eng/nodes"
	"github.com/NubeDev/flow-eng/schemas"
	"github.com/NubeIO/rubix-rules/clients/nresty"
)

func (inst *FlowClient) NodeSchema(nameName string) (*schemas.Schema, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&schemas.Schema{}).
		Get(fmt.Sprintf("/api/nodes/schema/%s", nameName)))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*schemas.Schema), nil
}

func (inst *FlowClient) NodePallet() ([]nodes.PalletNode, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&[]nodes.PalletNode{}).
		Get("/api/nodes/pallet"))
	if err != nil {
		return nil, err
	}
	var out []nodes.PalletNode
	out = *resp.Result().(*[]nodes.PalletNode)
	return out, nil
}

func (inst *FlowClient) GetBaseNodesList() ([]node.Spec, error) {
	resp, err := nresty.FormatRestyResponse(inst.client.R().
		SetResult(&[]node.Spec{}).
		Get("/api/nodes"))
	if err != nil {
		return nil, err
	}
	var out []node.Spec
	out = *resp.Result().(*[]node.Spec)
	return out, nil
}
