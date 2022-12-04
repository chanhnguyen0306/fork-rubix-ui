package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"github.com/go-resty/resty/v2"
	"testing"
)

var client = New(&Client{
	Rest: &resty.Client{},
	Ip:   "0.0.0.0",
	Port: 1662,
})

func TestApp_EdgeAppStatus(t *testing.T) {
	status, connectionErr, requestErr := client.EdgeAppStatus("rc", constants.FlowFramework)
	fmt.Println("status", status)
	fmt.Println("connectionErr", connectionErr)
	fmt.Println("requestErr", requestErr)
}
