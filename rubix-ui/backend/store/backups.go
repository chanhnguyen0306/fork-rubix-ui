package store

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
)

//makeUserPath  => /home/user/rubix/backups
func (inst *Store) makeBackupPath() error {
	return inst.App.MakeDirectoryIfNotExists(inst.BackupsDir, os.FileMode(FilePerm))
}

// SaveBackup save a backup to disc
func (inst *Store) SaveBackup(fileName string, data interface{}) error {
	err := inst.makeBackupPath()
	if err != nil {
		return err
	}
	path := fmt.Sprintf("%s/%s.json", inst.BackupsDir, fileName)
	saveJson, err := json.Marshal(data)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(path, saveJson, fs.FileMode(inst.Perm))
	if err != nil {
		return err
	}
	return nil
}
