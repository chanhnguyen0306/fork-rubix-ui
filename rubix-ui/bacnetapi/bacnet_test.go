package bacnetapi

import (
	pprint "github.com/NubeIO/rubix-ui/helpers/print"
	"testing"
)

func TestNew(t *testing.T) {

	c, err := New(&BacnetApi{
		Iface: "wlp3s0",
		Port:  47808,
	})

	whois, err := c.Whois(0, 0, 0)
	if err != nil {
		return
	}

	pprint.PrintJOSN(whois)

}
