package storage

import (
	"encoding/json"
	"fmt"
	"github.com/NubeIO/lib-uuid/uuid"
	"github.com/tidwall/buntdb"
	"log"
)

type inst struct {
	DB *buntdb.DB
}

func New(dbFile string) Storage {
	if dbFile == "" {
		dbFile = "data.db"
	}
	db, err := buntdb.Open(dbFile)
	if err != nil {
		log.Fatal(err)
	}
	return &inst{DB: db}
}

func (b *inst) Add(rc *RubixConnection) (*RubixConnection, error) {

	if rc.Name == "" {
		rc.Name = uuid.ShortUUID("tmp")
	}
	if rc.Description == "" {
		rc.Description = "a rubix connection to devices"
	}
	if rc.Customer == "" {
		rc.Customer = "nube"
	}
	if rc.IP == "" {
		rc.IP = "0.0.0.0"
	}
	if rc.Port == 0 {
		rc.Port = 1662

	}
	rc.UUID = uuid.ShortUUID("con")
	data, err := json.Marshal(rc)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	err = b.DB.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(rc.UUID, string(data), nil)
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	return rc, nil
}

func (b *inst) Update(uuid string, rc *RubixConnection) (*RubixConnection, error) {
	j, err := json.Marshal(rc)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	err = b.DB.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(uuid, string(j), nil)
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil, err
	}
	return rc, nil
}

func (b *inst) Delete(uuid string) error {
	err := b.DB.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(uuid)
		return err
	})
	if err != nil {
		fmt.Printf("Error delete: %s", err)
		return err
	}
	return nil
}

func (b *inst) Select(uuid string) (*RubixConnection, error) {
	var data *RubixConnection
	err := b.DB.View(func(tx *buntdb.Tx) error {
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
}

func (b *inst) SelectAll() ([]RubixConnection, error) {
	var resp []RubixConnection
	var data RubixConnection
	err := b.DB.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			err := json.Unmarshal([]byte(value), &data)
			if err != nil {
				return false
			}
			resp = append(resp, data)
			//fmt.Printf("key: %s, value: %s\n", key, value)
			return true
		})
		return err
	})
	if err != nil {
		fmt.Printf("Error: %s", err)
		return []RubixConnection{}, err
	}
	return resp, nil
}

func (b *inst) Wipe() (int, error) {
	connections, err := b.SelectAll()
	if err != nil {
		return 0, err
	}
	count := 0
	for _, connection := range connections {
		err = b.Delete(connection.UUID)
		if err != nil {
			return 0, err
		}
		count++
	}
	return count, nil
}

func (b *inst) Close() error {
	b.DB.Close()
	return nil
}
