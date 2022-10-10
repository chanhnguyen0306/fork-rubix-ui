package main

import (
	"fmt"
	"github.com/NubeDev/flow-eng/node"
	"github.com/NubeDev/flow-eng/nodes"
	"github.com/NubeIO/rubix-rules/flow"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"github.com/NubeIO/rubix-ui/flowcli"
	"github.com/mitchellh/mapstructure"
)

const flowEngIP = "0.0.0.0"

func (inst *App) NodeValues() []node.Values {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodeValues()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) GetFlow() interface{} {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.GetFlow()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) NodeSchema(nodeName string) *flowcli.Schema {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodeSchema(nodeName)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) NodePallet() []nodes.PalletNode {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodePallet()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) DownloadFlow(encodedNodes interface{}, restartFlow bool) *flow.Message {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	downloadFlow, err := client.DownloadFlow(encodedNodes, restartFlow)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return downloadFlow
	} else {
		inst.crudMessage(true, fmt.Sprintf(downloadFlow.Message))
	}
	return downloadFlow
}

func (inst *App) DownloadFlowDecoded(encodedNodes interface{}, restartFlow bool) *flow.Message {
	pprint.PrintJOSN(encodedNodes)
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	nodeList := &nodes.NodesList{}
	err := mapstructure.Decode(encodedNodes, &nodeList)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	downloadFlow, err := client.DownloadFlow(nodeList, restartFlow)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return downloadFlow
	} else {
		inst.crudMessage(true, fmt.Sprintf(downloadFlow.Message))
	}
	return downloadFlow
}
