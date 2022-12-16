package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/constants"
	"testing"
)

func TestClient_GetEdgeDeviceInfo(t *testing.T) {
	deviceInfo, err := client.GetEdgeDeviceInfo("rc")
	fmt.Println(deviceInfo)
	fmt.Println(err)
}

func TestClient_UpdateEdgeDeviceInfo(t *testing.T) {
	deviceInfo, err := client.GetEdgeDeviceInfo("rc")
	deviceInfo.DeviceType = constants.Cloud.String()
	deviceInfo, err = client.UpdateEdgeDeviceInfo("rc", deviceInfo)
	fmt.Println(deviceInfo)
	fmt.Println(err)
}
