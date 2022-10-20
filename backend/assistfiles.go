package backend

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/service/clients/assistcli"
	"os"
	"path"
)

func (inst *App) assistUploadFile(connUUID, destination, path_, fileName string) (*assistcli.EdgeUploadResponse, error) {
	client, err := inst.getAssistClient(&AssistClient{ConnUUID: connUUID})
	if err != nil {
		return nil, err
	}
	fileAndPath := path.Join(path_, fileName)
	file, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file: %s err: %s", fileAndPath, err.Error()))
	}
	return client.UploadFile(destination, fileName, file)
}
