package backend

import (
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-auth-go/externaltoken"
	"github.com/NubeIO/nubeio-rubix-lib-auth-go/user"
	"github.com/NubeIO/nubeio-rubix-lib-models-go/pkg/v1/model"
)

func (inst *App) EdgeBiosLogin(connUUID, hostUUID, username, password string) *model.TokenResponse {
	resp, err := inst.edgeBiosLogin(connUUID, hostUUID, username, password)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) EdgeBiosTokens(connUUID, hostUUID, jwtToken string) *[]externaltoken.ExternalToken {
	resp, err := inst.edgeBiosTokens(connUUID, hostUUID, jwtToken)
	if err != nil {
		inst.uiErrorMessage(fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	return resp
}

func (inst *App) edgeBiosLogin(connUUID, hostUUID, username, password string) (*model.TokenResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	body := user.User{Username: username, Password: password}
	resp, err := client.EdgeBiosLogin(hostUUID, &body)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) edgeBiosTokens(connUUID, hostUUID, jwtToken string) (*[]externaltoken.ExternalToken, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	resp, err := client.EdgeBiosTokens(hostUUID, jwtToken)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func (inst *App) InsertFakeExternalTokenModel() *externaltoken.ExternalToken { return nil }
