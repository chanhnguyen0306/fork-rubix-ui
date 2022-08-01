package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

func (app *App) GetGitToken(uuid string, previewToken bool) string {
	out, err := app.getGitToken(uuid, previewToken)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get git token:%s", err.Error()))
		return ""
	}
	return out
}

func (app *App) getGitToken(uuid string, previewToken bool) (string, error) {
	out, err := app.DB.GetGitToken(uuid, previewToken)
	if err != nil {
		return "", err
	}
	return out, nil
}

func (app *App) UpdateSettings(uuid string, body *storage.Settings) *storage.Settings {
	out, err := app.DB.UpdateSettings(uuid, body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error on update settings:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) GetSetting(uuid string) *storage.Settings {
	out, err := app.DB.GetSetting(uuid)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error on update settings:%s", err.Error()))
		return nil
	}
	return out
}
