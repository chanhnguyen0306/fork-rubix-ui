package storage

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/NubeIO/rubix-ui/backend/helpers/ttime"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
	"github.com/tidwall/buntdb"
	"sort"
	"time"
)

func (inst *db) AddBackup(body *Backup) (*Backup, error) {
	err := logstore.CheckApplication(body.Application)
	if err != nil {
		return nil, err
	}

	body.Time = ttime.New().Now()
	body.UUID = uuid.ShortUUID("bac")
	if body.UserComment == "" {
		body.UserComment = body.Time.Format(time.RFC822)
	}
	body.UserComment = fmt.Sprintf("%s backup: %s", body.HostName, body.UserComment)

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

func (inst *db) GetBackups() ([]Backup, error) {
	var resp []Backup
	var data Backup
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchBackupUUID(data.UUID) {
				resp = append(resp, data)
				//fmt.Printf("key: %s, value: %s\n", key, value)
			}

			return true
		})
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return []Backup{}, err
	}
	sort.Slice(resp, func(i, j int) bool {
		return resp[i].Time.Before(resp[j].Time)
	})
	return resp, nil
}
