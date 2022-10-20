package flow

import "github.com/NubeIO/rubix-assist/service/clients/ffclient"

func New(conn *ffclient.Connection) *ffclient.FlowClient {
	return ffclient.NewLocalClient(conn)
}
