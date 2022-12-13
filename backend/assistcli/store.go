package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/amodel"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"io"
)

func (inst *Client) UploadAppOnAppStore(appName, version, arch, fileName string, reader io.Reader) (
	*appstore.UploadResponse, error) {
	url := fmt.Sprintf("/api/store/apps?name=%s&version=%s&arch=%s", appName, version, arch)
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetResult(&appstore.UploadResponse{}).
		SetFileReader("file", fileName, reader).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*appstore.UploadResponse), nil
}

func (inst *Client) CheckAppExistence(appName, version, arch string) error {
	url := fmt.Sprintf("/api/store/apps/exists?name=%s&arch=%s&version=%s", appName, arch, version)
	_, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetResult(&amodel.FoundMessage{}).
		Get(url))
	return err
}
