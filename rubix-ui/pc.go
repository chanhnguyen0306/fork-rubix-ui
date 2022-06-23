package main

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
	"github.com/NubeIO/rubix-ui/backend/system/scanner"
)

func (app *App) GetPcGetNetworksSchema() interface{} {
	names, err := nets.GetNetworks()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	b, err := json.Marshal(names)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return humanize.ArrayOfMaps(b)
}

func (app *App) GetPcGetNetworks() interface{} {
	names, err := nets.GetNetworks()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return []networking.NetworkInterfaces{}
	}
	return names
}

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
