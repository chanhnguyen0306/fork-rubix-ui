package files

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"testing"
)

func TestFiles_readFiles(t *testing.T) {

	f := New()
	file, err := f.readFiles("rubix/builds")
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(file)
}
