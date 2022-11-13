package flowcli

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

var client = New(nil)

func TestFlowClient_GetConnections(t *testing.T) {
	start, err := client.GetConnections()
	fmt.Println(start, err)
	if err != nil {
		return
	}
}

func TestFlowClient_Schema(t *testing.T) {
	start, err := client.NodeSchema("add")
	fmt.Println(start, err)
	if err != nil {
		return
	}
}

func TestFlowClient_GetBaseNodesList(t *testing.T) {
	start, err := client.GetBaseNodesList()
	fmt.Println(start, err)
	if err != nil {
		return
	}
}

func TestFlowClient_NodePallet(t *testing.T) {
	data, err := client.NodePallet()
	fmt.Println(data)
	if err != nil {
		return
	}
}

func TestFlowClient_GetFlow(t *testing.T) {
	start, err := client.GetFlow()
	pprint.PrintJOSN(start)
	fmt.Println(start, err)
	if err != nil {
		return
	}
}

func TestFlowClient_FlowStop(t *testing.T) {
	start, err := client.FlowStop()
	fmt.Println(start, err)
	if err != nil {
		return
	}
}

func TestFlowClient_FlowStart(t *testing.T) {
	start, err := client.FlowStart()
	fmt.Println(start, err)
	if err != nil {
		return
	}
}
