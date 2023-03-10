package assistcli

import (
	"fmt"
	"testing"
	"time"
)

func TestHost(*testing.T) {
	hosts, _ := client.GetHosts()
	uuid := ""
	for _, host := range hosts {
		uuid = host.UUID
	}
	if uuid == "" {
		return
	}

	host, res := client.GetHost(uuid)
	fmt.Println(res.StatusCode)
	if res.StatusCode != 200 {
		// return
	}
	fmt.Println(host)
	host.Name = fmt.Sprintf("name_%d", time.Now().Unix())
	host, res = client.AddHost(host)
	host.Name = "get " + fmt.Sprintf("name_%d", time.Now().Unix())
	if res.StatusCode != 200 {
		return
	}
	fmt.Println("NEW host", host.Name)
	host, res = client.UpdateHost(host.UUID, host)
	if res.StatusCode != 200 {
		return
	}
	fmt.Println(host.Name, host.UUID)
	fmt.Println(res.StatusCode)
	res = client.DeleteHost(host.UUID)
	if res.StatusCode != 200 {
		return
	}
}
