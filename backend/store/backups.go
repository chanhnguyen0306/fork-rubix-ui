package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"path"
)

// SaveBackup save a backup to disc
func (inst *AppStore) SaveBackup(fileName string, data interface{}) error {
	_path := path.Join(inst.Store.BackupsDir, fmt.Sprintf("%s.json", fileName))
	saveJson, err := json.Marshal(data)
	if err != nil {
		return errors.New(fmt.Sprintf("export backup json marshal err: %s", err.Error()))
	}
	err = ioutil.WriteFile(_path, saveJson, fs.FileMode(inst.Store.Perm))
	if err != nil {
		return err
	}
	return nil
}
