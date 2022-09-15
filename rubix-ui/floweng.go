package main

import (
	"fmt"
	"github.com/NubeDev/flow-eng/nodes"
	"github.com/NubeIO/rubix-rules/flow"
	"github.com/NubeIO/rubix-ui/flowcli"
	"github.com/mitchellh/mapstructure"
)

func (inst *App) NodePallet() []nodes.PalletNode {
	var client = flowcli.New(nil)
	resp, err := client.NodePallet()
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) DownloadFlow(encodedNodes interface{}, restartFlow bool) *flow.Message {
	var client = flowcli.New(nil)
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
