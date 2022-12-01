package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	pprint "github.com/NubeIO/rubix-assist/pkg/helpers/print"
	"testing"
)

func TestClient_EdgeUploadPlugin(t *testing.T) {
	data, err := client.UploadPlugin("rc", &amodel.Plugin{
		Name:    "bacnetserver",
		Arch:    "amd64",
		Version: "v0.6.6",
	})
	fmt.Println(err)
	pprint.PrintJSON(data)
}

func TestClient_EdgeDeletePlugin(t *testing.T) {
	data, err := client.DeletePlugin("rc", &amodel.Plugin{
		Name: "bacnetserver",
		Arch: "amd64",
	})
	fmt.Println(err)
	pprint.PrintJSON(data)
}
