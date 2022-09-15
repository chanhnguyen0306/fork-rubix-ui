package main

import (
	"fmt"
	"github.com/NubeDev/flow-eng/nodes"
	"github.com/NubeIO/rubix-rules/flow"
	"github.com/NubeIO/rubix-ui/flowcli"
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
	nodesList, ok := encodedNodes.(*nodes.NodesList)
	if !ok {
		inst.crudMessage(false, fmt.Sprintf("failed to decode nodes"))
		return nil
	}
	downloadFlow, err := client.DownloadFlow(nodesList, restartFlow)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return downloadFlow
	}
	return downloadFlow
}
