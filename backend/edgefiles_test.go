package backend

import (
	"fmt"
	pprint "github.com/NubeIO/rubix-ui/backend/helpers/print"
	"gopkg.in/yaml.v3"
	"testing"
)

type testYml struct {
	Auth bool `json:"auth" yaml:"auth"`
}

func TestApp_edgeReadFile(t *testing.T) {
	app := NewApp()
	file, err := app.edgeReadFile("cloud", "rc", "/data/flow-framework/config/config.yml")
	fmt.Println(err)
	fmt.Println(string(file))
	if err != nil {
		return
	}
	data := testYml{}
	err = yaml.Unmarshal(file, &data)
	fmt.Println(err)
	if err != nil {
		return
	}
	pprint.PrintJOSN(data)
}
