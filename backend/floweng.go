package backend

import (
	"fmt"
	"github.com/NubeDev/flow-eng/db"
	"github.com/NubeDev/flow-eng/node"
	"github.com/NubeDev/flow-eng/nodes"
	"github.com/NubeIO/rubix-edge-wires/flow"
	"github.com/NubeIO/rubix-ui/flowcli"
	"github.com/mitchellh/mapstructure"
)

var flowEngIP = "0.0.0.0"

func (inst *App) GetWiresConnections(connUUID, hostUUID string, isRemote bool) []db.Connection {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.GetConnections()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) UpdateWiresConnection(connUUID, hostUUID string, isRemote bool, uuid string, body *db.Connection) *db.Connection {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.UpdateConnection(uuid, body)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) AddWiresConnection(connUUID, hostUUID string, isRemote bool, body *db.Connection) *db.Connection {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.AddConnection(body)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) BulkDeleteWiresConnection(connUUID, hostUUID string, isRemote bool, uuids []string) interface{} {
	var addedCount int
	var errorCount int
	for _, item := range uuids {
		err := inst.deleteWiresConnection(connUUID, hostUUID, isRemote, item)
		if err != nil {
			errorCount++
			inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		} else {
			addedCount++
		}
	}
	if addedCount > 0 {
		inst.uiSuccessMessage(fmt.Sprintf("delete count: %d", addedCount))
	}
	if errorCount > 0 {
		inst.uiErrorMessage(fmt.Sprintf("failed to delete count: %d", errorCount))
	}
	return nil
}

func (inst *App) deleteWiresConnection(connUUID, hostUUID string, isRemote bool, uuid string) error {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	err := client.DeleteConnection(uuid)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return err
	}
	inst.uiSuccessMessage(fmt.Sprintf("ok"))
	return nil
}

func (inst *App) DeleteWiresConnection(connUUID, hostUUID string, isRemote bool, uuid string) {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	err := client.DeleteConnection(uuid)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return
	}
	inst.uiSuccessMessage(fmt.Sprintf("ok"))
}

func (inst *App) GetWiresConnection(connUUID, hostUUID string, isRemote bool, uuid string) *db.Connection {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.GetConnection(uuid)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) NodeValue(connUUID, hostUUID string, isRemote bool, nodeUUID string) *node.Values {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodeValue(nodeUUID)
	if err != nil {
		return resp
	}
	return resp
}

func (inst *App) NodeValues(connUUID, hostUUID string, isRemote bool) []node.Values {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodeValues()
	if err != nil {
		inst.uiErrorMessage("flow runtime is not running")
		return resp
	}
	return resp
}

func (inst *App) GetFlow(connUUID, hostUUID string, isRemote bool) interface{} {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.GetFlow()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) NodeSchema(connUUID, hostUUID string, isRemote bool, nodeName string) *flowcli.Schema {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodeSchema(nodeName)
	if err != nil {
		inst.uiErrorMessage("download the node first to edit the settings")
		return resp
	}
	return resp
}

func (inst *App) NodePallet(connUUID, hostUUID string, isRemote bool) []nodes.PalletNode {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	resp, err := client.NodePallet()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return resp
	}
	return resp
}

func (inst *App) DownloadFlow(connUUID, hostUUID string, isRemote bool, encodedNodes interface{}, restartFlow bool) *flow.Message {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	downloadFlow, err := client.DownloadFlow(encodedNodes, restartFlow)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return downloadFlow
	} else {
		inst.uiSuccessMessage(fmt.Sprintf(downloadFlow.Message))
	}
	return downloadFlow
}

func (inst *App) DownloadFlowDecoded(connUUID, hostUUID string, isRemote bool, encodedNodes interface{}, restartFlow bool) *flow.Message {
	var client = flowcli.New(&flowcli.Connection{Ip: flowEngIP})
	nodeList := &nodes.NodesList{}
	err := mapstructure.Decode(encodedNodes, &nodeList)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	downloadFlow, err := client.DownloadFlow(nodeList, restartFlow)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return downloadFlow
	} else {
		inst.uiSuccessMessage(fmt.Sprintf(downloadFlow.Message))
	}
	return downloadFlow
}
