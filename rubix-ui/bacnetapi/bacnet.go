package bacnetapi

import (
	"fmt"
	"github.com/NubeDev/bacnet"
	"github.com/NubeDev/bacnet/network"
)

type BacnetApi struct {
	Iface         string
	Port          int
	NetworkNumber uint16
}

func New(bac *BacnetApi) {

	if bac == nil {

	}

	client, err := network.New(&network.Network{Interface: bac.Iface, Port: bac.Port})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer client.NetworkClose()
	go client.NetworkRun()

	wi := &bacnet.WhoIsOpts{
		High:            0,
		Low:             0,
		GlobalBroadcast: true,
		NetworkNumber:   0,
	}

	whoIs, err := client.Whois(wi)
	if err != nil {
		fmt.Println("ERR-whoIs", err)
		//return
	}
	fmt.Println("whoIs", whoIs)
}
