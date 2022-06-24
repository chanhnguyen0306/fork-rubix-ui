package main

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-date/datelib"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/rubix-ui/backend/helpers/humanize"
	"github.com/NubeIO/rubix-ui/backend/system/scanner"
	"os/exec"
	"runtime"
)

var pcDate = datelib.New(&datelib.Date{})

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

func (app *App) GetPcTime() *datelib.Time {
	return pcDate.SystemTime()
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

func (app *App) OpenURL(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("cmd", "/c", "start", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	fmt.Println(err)
}
