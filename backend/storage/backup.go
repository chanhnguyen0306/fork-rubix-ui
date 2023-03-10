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
	"strings"
	"time"
)

func strip(s string) string {
	var result strings.Builder
	for i := 0; i < len(s); i++ {
		b := s[i]
		if ('a' <= b && b <= 'z') ||
			('A' <= b && b <= 'Z') ||
			('0' <= b && b <= '9') ||
			b == ' ' {
			result.WriteByte(b)
		}
	}
	return result.String()
}

func (inst *db) AddBackup(body *Backup) (*Backup, error) {

	err := logstore.CheckApplication(body.Application)
	if err != nil {
		return nil, err
	}
	err = logstore.CheckSubApplication(body.SubApplication)
	if err != nil {
		return nil, err
	}
	if body.ConnectionUUID == "" {
		return nil, errors.New("connection uuid can not be empty")
	}
	if body.ConnectionUUID == "" {
		return nil, errors.New("connection uuid can not be empty")
	}
	if body.HostUUID == "" {
		return nil, errors.New("host uuid can not be empty")
	}
	if body.HostName == "" {
		return nil, errors.New("host name can not be empty")
	}
	body.Time = ttime.New().Now()
	body.Timestamp = body.Time.Format(time.RFC822)
	body.UUID = uuid.ShortUUID("bac")
	body.UserComment = strip(body.UserComment)
	if body.UserComment == "" {
		body.UserComment = fmt.Sprintf(body.UserComment)
	}
	if body.BackupInfo == "" {
		body.BackupInfo = fmt.Sprintf("host-%s connection-%s", body.HostName, body.HostName)
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

func (inst *db) DeleteBackup(uuid string) error {
	if matchBackupUUID(uuid) {
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
	return errors.New("incorrect backup uuid")
}

func (inst *db) GetBackup(uuid string) (*Backup, error) {
	if matchBackupUUID(uuid) {
		var data *Backup
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
		return nil, errors.New("incorrect backup uuid")
	}
}

func (inst *db) GetBackupsByHostUUID(uuid string) ([]Backup, error) {
	var resp []Backup
	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			var data Backup
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			if matchBackupUUID(data.HostUUID) {
				if uuid == data.HostUUID {
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
		return []Backup{}, err
	}
	sort.Slice(resp, func(i, j int) bool {
		return resp[i].Time.Before(resp[j].Time)
	})
	return resp, nil
}

func (inst *db) GetBackups() ([]Backup, error) {
	var resp []Backup

	err := inst.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			var data Backup
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
