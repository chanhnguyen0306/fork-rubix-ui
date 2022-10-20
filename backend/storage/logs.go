package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/rubix-ui/backend/helpers/ttime"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	"github.com/tidwall/buntdb"
	"sort"
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

	body.Time = ttime.New().Now(true)
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
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			var data Log
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchLogUUID(data.UUID) {
				resp = append(resp, data)
				//fmt.Printf("key: %s, value: %s\n", key, value)
			}
			return true
		})
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return []Log{}, err
	}
	sort.Slice(resp, func(i, j int) bool {
		return resp[i].Time.Before(resp[j].Time)
	})
	return resp, nil
}

func (inst *db) GetLogsByConnection(uuid string) ([]Log, error) {
	var resp []Log
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			var data Log
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchLogUUID(data.UUID) {
				if uuid == data.UUID {
					resp = append(resp, data)
					//fmt.Printf("key: %s, value: %s\n", key, value)
				}
			}
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

func (inst *db) DeleteLog(uuid string) error {
	if matchLogUUID(uuid) {
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
	return errors.New("incorrect log uuid")
}
