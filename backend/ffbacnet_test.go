package backend

import (
	"fmt"
	"testing"
)

func TestApp_bacnetWhois(t *testing.T) {
	app := MockNewApp()
	whois, err := app.bacnetWhois("cloud", "rc", "net_5110e7411c1e4695", bacnetMasterPlg)
	fmt.Println(err)
	fmt.Println(whois)
	if err != nil {
		return
	}
}
