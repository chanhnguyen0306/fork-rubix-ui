package files

import (
	"fmt"
	"testing"
)

func TestFiles_readFiles(t *testing.T) {

	f := New()
	file, err := f.GetBackUpFile("wires-example.json")
	fmt.Println(err)
	if err != nil {
		return
	}
	fmt.Println(file)
}
