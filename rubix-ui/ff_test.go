package main

import (
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_GetStreams(t *testing.T) {

	app := NewApp()
	bulk := app.GetStreams("cloud", "hos_0F226C392A55")
	pprint.PrintJOSN(bulk)

}

func TestApp_AddStream(t *testing.T) {

	app := NewApp()
	stream := &model.Stream{
		CommonStream: model.CommonStream{
			CommonName: model.CommonName{
				Name: "test",
			},
		},
	}
	bulk := app.AddStream("cloud", "hos_0F226C392A55", []string{"fln_45c87700647940ed"}, stream)
	pprint.PrintJOSN(bulk)

}
