package main

import (
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/storage"
)

func (app *App) GetGitToken() string {
	out, err := app.getGitToken()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error get git token:%s", err.Error()))
		return ""
	}
	return out
}

func (app *App) getGitToken() (string, error) {
	out, err := app.DB.GetGitToken()
	if err != nil {
		return "", err
	}
	return out, nil
}

func (app *App) UpdateSettings(body *storage.Settings) *storage.Settings {
	out, err := app.DB.UpdateSettings(body)
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error on update settings:%s", err.Error()))
		return nil
	}
	return out
}

func (app *App) GetSetting() *storage.Settings {
	out, err := app.DB.GetSetting()
	if err != nil {
		app.crudMessage(false, fmt.Sprintf("error on update settings:%s", err.Error()))
		return nil
	}
	return out
}
