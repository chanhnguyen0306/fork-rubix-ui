package main

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (app *App) GetNetworksWithPoints(connUUID, hostUUID string) *[]model.Network {
	app.resetHost(connUUID, hostUUID, true)
	points, err := app.flow.GetNetworksWithPoints()
	if err != nil {

	}
	fmt.Println(points)
	return nil
}
