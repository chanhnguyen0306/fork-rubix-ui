package backend

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

func (inst *App) getPcGetNetworksSchema() ([]networking.NetworkInterfaces, error) {
	return nets.GetNetworks()
}

func (inst *App) getInternetIP() (networking.Check, error) {
	return nets.GetInternetIP()
}

func (inst *App) GetPcGetNetworksSchema() interface{} {
	names, err := nets.GetNetworks()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	b, err := json.Marshal(names)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return humanize.ArrayOfMaps(b)
}

func (inst *App) GetPcTime() *datelib.Time {
	return pcDate.SystemTime()
}

func (inst *App) GetPcGetNetworks() interface{} {
	names, err := nets.GetNetworks()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return []networking.NetworkInterfaces{}
	}
	return names
}

func (inst *App) GetPcInterfaces() networking.InterfaceNames {
	names, err := nets.GetInterfacesNames()
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return networking.InterfaceNames{}
	}
	return names
}

func (inst *App) GetScannerSchema() interface{} {
	return scanner.BuildSchema()
}

func (inst *App) Scanner(iface, ip string, count int, ports []string) interface{} {
	runScanner, err := scanner.RunScanner(iface, ip, count, ports)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return runScanner
}

func (inst *App) OpenURL(url string) {
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
