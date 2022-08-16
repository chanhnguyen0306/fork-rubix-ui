package main

import (
	"errors"
	"fmt"
	"github.com/NubeIO/rubix-assist/service/clients/assitcli"
	"os"
)

func (inst *App) assistUploadFile(connUUID, destination, path, fileName string) (*assitcli.EdgeUploadResponse, error) {
	client, err := inst.initConnection(connUUID)
	if err != nil {
		return nil, err
	}
	fileAndPath := inst.store.FilePath(fmt.Sprintf("%s/%s", path, fileName))
	file, err := os.Open(fileAndPath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("error open file:%s err:%s", fileAndPath, err.Error()))
	}
	return client.UploadFile(destination, fileName, file)
}
