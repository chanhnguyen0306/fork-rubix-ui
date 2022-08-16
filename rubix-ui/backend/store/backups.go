package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
)

// SaveBackup save a backup to disc
func (inst *Store) SaveBackup(fileName string, data interface{}) error {
	err := inst.makeBackupPath()
	if err != nil {
		return err
	}
	path := fmt.Sprintf("%s/%s.json", inst.BackupsDir, fileName)
	saveJson, err := json.Marshal(data)
	if err != nil {
		return errors.New(fmt.Sprintf("export backup json marshal err:%s", err.Error()))
	}
	err = ioutil.WriteFile(path, saveJson, fs.FileMode(inst.Perm))
	if err != nil {
		return err
	}
	return nil
}
