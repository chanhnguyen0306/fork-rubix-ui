package assistcli

import (
	"fmt"
	"testing"
	"time"
)

func TestHostNetwork(*testing.T) {
	hosts, _ := client.GetHostNetworks()
	fmt.Println(222, hosts)
	uuid := ""
	fmt.Println(hosts)
	for _, host := range hosts {
		uuid = host.UUID
	}
	if uuid == "" {
		return
	}

	host, res := client.GetHostNetwork(uuid)
	fmt.Println(res.StatusCode)
	if res.StatusCode != 200 {
		// return
	}
	fmt.Println(host)
	host.Name = fmt.Sprintf("name_%d", time.Now().Unix())
	host, res = client.AddHostNetwork(host)
	host.Name = "get " + fmt.Sprintf("name_%d", time.Now().Unix())
	if res.StatusCode != 200 {
		// return
	}
	fmt.Println("NEW host", host.Name)
	host, res = client.UpdateHostNetwork(host.UUID, host)
	if res.StatusCode != 200 {
		// return
	}
	fmt.Println(host.Name, host.UUID)

	res = client.DeleteHostNetwork(host.UUID)
}
