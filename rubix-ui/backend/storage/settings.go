package storage

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/tidwall/buntdb"
)

type Settings struct {
	UUID     string
	Theme    string `json:"theme"` // light, dark
	GitToken string `json:"git_token"`
}

func (inst *db) Settings(body *Settings) (*Settings, error) {
	body.UUID = uuid.ShortUUID("set")
	if body.GitToken != "" {
		body.GitToken = encodeToken(body.GitToken)
	}
	data, err := json.Marshal(body)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	err = inst.DB.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(body.UUID, string(data), nil)
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	return body, nil
}

func (inst *db) UpdateSettings(uuid string, body *Settings) (*Settings, error) {
	j, err := json.Marshal(body)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	err = inst.DB.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(uuid, string(j), nil)
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	return body, nil
}

func (inst *db) DeleteSettings(uuid string) error {
	err := inst.DB.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(uuid)
		return err
	})
	if err != nil {
		fmt.Printf("Error delete: %s", err)
		return err
	}
	return nil
}

func (inst *db) GetGitToken(uuid string) (string, error) {
	if matchSettingsUUID(uuid) {
		var data *Settings
		err := inst.DB.View(func(tx *buntdb.Tx) error {
			val, err := tx.Get(uuid)
			if err != nil {
				return err
			}
			err = json.Unmarshal([]byte(val), &data)
			if err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			fmt.Printf("Error: %s", err)
			return "", err
		}
		if data.GitToken != "" {
			data.GitToken = decodeToken(data.GitToken)
		}
		return data.GitToken, nil
	} else {
		return "", errors.New("incorrect settings uuid")
	}
}

func (inst *db) GetSettings(uuid string) (*Settings, error) {
	if matchSettingsUUID(uuid) {
		var data *Settings
		err := inst.DB.View(func(tx *buntdb.Tx) error {
			val, err := tx.Get(uuid)
			if err != nil {
				return err
			}
			err = json.Unmarshal([]byte(val), &data)
			if err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			fmt.Printf("Error: %s", err)
			return nil, err
		}
		return data, nil
	} else {
		return nil, errors.New("incorrect settings uuid")
	}
}

func encodeToken(token string) string {
	return base64.StdEncoding.EncodeToString([]byte(token))
}

func decodeToken(token string) string {
	data, _ := base64.StdEncoding.DecodeString(token)
	return string(data)
}
