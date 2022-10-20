package storage

import (
	"github.com/tidwall/buntdb"
	"log"
	"os"
)

type db struct {
	DB *buntdb.DB
}

func New(dbFile string) Storage {
	err := os.MkdirAll("data", 0755)
	if err != nil {
		panic("data directory creation issue")
	}
	if dbFile == "" {
		dbFile = "data/data.db"
	}
	newDb, err := buntdb.Open(dbFile)
	if err != nil {
		log.Fatal(err)
	}
	return &db{DB: newDb}
}

func (inst *db) Close() error {
	inst.DB.Close()
	return nil
}

func matchConnUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "con_" {
			return true
		}
	}
	return false
}

func matchSettingsUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "set_" {
			return true
		}
	}
	return false
}

func matchBackupUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "bac_" {
			return true
		}
	}
	return false
}

func matchReleaseUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "rel_" {
			return true
		}
	}
	return false
}

func matchLogUUID(uuid string) bool {
	if len(uuid) == 16 {
		if uuid[0:4] == "log_" {
			return true
		}
	}
	return false
}
