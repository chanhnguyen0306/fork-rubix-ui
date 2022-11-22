package assistcli

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-assist/pkg/helpers/print"
	"github.com/go-resty/resty/v2"
	"testing"
)

var client = New(&Client{
	Rest: &resty.Client{},
	Ip:   "0.0.0.0",
	Port: 1662,
})

func TestClient_EdgeProductInfo(t *testing.T) {
	data, err := client.EdgeProductInfo("rc")
	fmt.Println(err)
	pprint.PrintJSON(data)
}
