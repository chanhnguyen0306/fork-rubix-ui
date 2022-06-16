package storage

import (
	"fmt"
	"testing"
)

func TestInitializeBuntDB(t *testing.T) {
	db := New("test.db")
	add, err := db.Add(&RubixConnection{
		Name:        "test",
		Description: "test",
		Customer:    "test",
		Connection: &Connection{
			Username: "test",
			Password: "test",
			Ip:       "0.0.0.0",
			Port:     1662,
			HTTPS:    false,
		},
	})
	fmt.Println(err, add)
	if err != nil {
		return
	}

	all, err := db.SelectAll()
	if err != nil {
		return
	}

	last := RubixConnection{}

	for i, toggle := range all {
		fmt.Println(i, toggle)
		last = toggle
	}

	toggle, err := db.Select(last.UUID)
	if err != nil {
		return
	}
	db.Wipe()

	fmt.Println(toggle.Description)

}
