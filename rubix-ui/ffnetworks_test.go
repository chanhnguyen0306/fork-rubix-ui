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
