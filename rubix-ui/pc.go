package main

import (
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/helpers/system/scanner"
)

func (app *App) GetPcInterfaces() networking.InterfaceNames {
	names, err := nets.GetInterfacesNames()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return networking.InterfaceNames{}
	}
	return names
}

func (app *App) GetScannerSchema() interface{} {
	return scanner.BuildSchema()
}

func (app *App) Scanner(iface, ip string, count int, ports []string) interface{} {
	runScanner, err := scanner.RunScanner(iface, ip, count, ports)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return runScanner
}
