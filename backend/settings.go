package backend

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

func (inst *App) GetGitToken(uuid string, previewToken bool) (string, error) {
	out, err := inst.DB.GetGitToken(uuid, previewToken)
	if err != nil {
		return "", err
	}
	return out, nil
}

func (inst *App) UpdateSettings(uuid string, body *storage.Settings) *storage.Settings {
	out, err := inst.DB.UpdateSettings(uuid, body)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error on update settings: %s", err.Error()))
		return nil
	}
	return out
}

func (inst *App) GetSetting(uuid string) *storage.Settings {
	out, err := inst.DB.GetSetting(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error on update settings: %s", err.Error()))
		return nil
	}
	return out
}
