package bacnetapi

import (
	"errors"
	"fmt"
	"github.com/NubeDev/bacnet"
	"github.com/NubeDev/bacnet/btypes"
	"github.com/NubeDev/bacnet/network"
)

type InterfaceNames struct {
	Names []string `json:"interface_names"`
}

type BacnetApi struct {
	Iface  string
	Port   int
	client *network.Network
}

func New(bac *BacnetApi) (*BacnetApi, error) {
	if bac == nil {
		return nil, errors.New("bacnet type cant not be empty")
	}
	client, err := network.New(&network.Network{Interface: bac.Iface, Port: bac.Port})
	if err != nil {
		fmt.Println("ERR-client", err)
		return nil, err
	}
	bac.client = client
	return bac, err

}

func (inst *BacnetApi) Whois(lowLimit, highLimit, networkNumber int) ([]btypes.Device, error) {
	client := inst.client

	defer client.NetworkClose()
	go client.NetworkRun()

	wi := &bacnet.WhoIsOpts{
		High:            highLimit,
		Low:             lowLimit,
		GlobalBroadcast: true,
		NetworkNumber:   uint16(networkNumber),
	}

	whoIs, err := client.Whois(wi)
	if err != nil {
		return []btypes.Device{}, err
	}
	return whoIs, nil
}
