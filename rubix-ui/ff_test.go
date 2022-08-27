package main

import (
	"fmt"
	"testing"

	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
)

func TestApp_addFlowNetwork(t *testing.T) {
	app := NewApp()
	body := &model.FlowNetwork{
		CommonFlowNetwork: model.CommonFlowNetwork{
			CommonName: model.CommonName{
				Name: "test",
			},
		},
	}
	bulk, err := app.addFlowNetwork("cloud", "hos_0F226C392A55", body)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(bulk)

}
