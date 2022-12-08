package assistcli

import (
	"fmt"
	"github.com/NubeIO/rubix-assist/installer"
	"github.com/NubeIO/rubix-assist/service/appstore"
	"github.com/NubeIO/rubix-assist/service/clients/helpers/nresty"
	"io"
)

func (inst *Client) StoreListPlugins() ([]installer.BuildDetails, error, error) {
	url := fmt.Sprintf("/api/store/plugins")
	resp, connectionErr, requestErr := nresty.FormatRestyV2Response(inst.Rest.R().
		SetResult(&[]installer.BuildDetails{}).
		Get(url))
	if connectionErr != nil || requestErr != nil {
		return nil, connectionErr, requestErr
	}
	return *resp.Result().(*[]installer.BuildDetails), nil, nil
}

func (inst *Client) StoreUploadPlugin(fileName string, reader io.Reader) (*appstore.UploadResponse, error) {
	url := fmt.Sprintf("/api/store/plugins")
	resp, err := nresty.FormatRestyResponse(inst.Rest.R().
		SetResult(&appstore.UploadResponse{}).
		SetFileReader("file", fileName, reader).
		Post(url))
	if err != nil {
		return nil, err
	}
	return resp.Result().(*appstore.UploadResponse), nil
}
