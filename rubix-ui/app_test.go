package main

import (
	pprint "github.com/NubeIO/rubix-ui/helpers/print"
	"testing"
)

func TestNewApp(t *testing.T) {

	app := NewApp()

	a := app.GetLogs()

	//elementMap := make(map[string]string)
	//for i := 0; i < len(elements); i +=2 {
	//	elementMap[elements[i]] = elements[i+1]
	//}
	pprint.PrintJOSN(a)
}
