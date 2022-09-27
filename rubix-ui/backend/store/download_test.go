package store

import (
	"fmt"
	"testing"
)

func TestStore_UnPackWires(t *testing.T) {
	appVersion := "v2.7.4"
	appStore, err := New(&Store{})
	fmt.Println(err)

	err = appStore.UnPackWires(appVersion)
	fmt.Println(err)
	if err != nil {
		return
	}
}
