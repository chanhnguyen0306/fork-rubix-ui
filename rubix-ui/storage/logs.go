package storage

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/rubix-ui/helpers/ttime"
	"github.com/NubeIO/rubix-ui/storage/logstore"
	"github.com/tidwall/buntdb"
)

func (inst *db) AddLog(body *Log) (*Log, error) {

	err := logstore.CheckFunction(body.Function)
	if err != nil {
		return nil, err
	}
	err = logstore.CheckType(body.Type)
	if err != nil {
		return nil, err
	}

	body.Time = ttime.New().Now()
	body.UUID = uuid.ShortUUID("log")

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

func (inst *db) GetLogs() ([]Log, error) {
	var resp []Log
	var data Log
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchLogUUID(data.UUID) {
				resp = append(resp, data)
			}
			//fmt.Printf("key: %s, value: %s\n", key, value)
			return true
		})
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return []Log{}, err
	}
	return resp, nil
}

func (inst *db) GetLogsByConnection(uuid string) ([]Log, error) {
	var resp []Log
	var data Log
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchLogUUID(data.UUID) {
				resp = append(resp, data)
			}
			//fmt.Printf("key: %s, value: %s\n", key, value)
			return true
		})
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return []Log{}, err
	}
	return resp, nil
}
