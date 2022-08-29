package main

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestApp_getNetworksWithPointsDisplay(t *testing.T) {
	app := NewApp()
	bulk, err := app.getNetworksWithPointsDisplay("cloud", "rc")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(bulk)

}

func TestApp_getNetwork(t *testing.T) {

	//net_8e292db59d7e4ad8
	app := NewApp()
	network, err := app.getNetwork("cloud", "rc", "net_8e292db59d7e4ad8", true)
	if err != nil {
		return
	}
	pprint.PrintJOSN(network)
}

func TestApp_getNetworksWithPoints(t *testing.T) {

	//net_8e292db59d7e4ad8
	app := NewApp()
	network, err := app.getNetworksWithPoints("cloud", "rc")
	if err != nil {
		return
	}
	pprint.PrintJOSN(network)
}
