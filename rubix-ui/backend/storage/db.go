package storage

import (
	"github.com/tidwall/buntdb"
	"log"
)

type db struct {
	DB *buntdb.DB
}

func New(dbFile string) Storage {
	if dbFile == "" {
		dbFile = "../data.db"
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
