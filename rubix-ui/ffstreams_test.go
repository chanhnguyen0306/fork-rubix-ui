package main

import (
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_AddStream(t *testing.T) {
	app := NewApp()
	body := &model.Stream{
		CommonStream: model.CommonStream{
			CommonName: model.CommonName{
				Name: "test111",
			},
		},
	}
	uuids := []string{"fln_acdbec73d4894bb9"}
	bulk := app.AddStream("cloud", "hos_DABC722D420A", uuids, body)
	pprint.PrintJOSN(bulk)

}
