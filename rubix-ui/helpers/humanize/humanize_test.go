package humanize

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"testing"
)

type name struct {
	AA string `json:"im_aa"`
	BB string `json:"ImBB"`
	CC string `json:"imCC"`
	DD string `json:"im dd"`
}

func parseMap(aMap map[string]interface{}) {
	for key, val := range aMap {
		switch concreteVal := val.(type) {
		case map[string]interface{}:
			fmt.Println(key)
			parseMap(val.(map[string]interface{}))
		case []interface{}:
			fmt.Println(key)
			parseArray(val.([]interface{}))
		default:
			fmt.Println(key, ":", concreteVal)
		}
	}
}

func parseArray(anArray []interface{}) {
	for i, val := range anArray {
		switch concreteVal := val.(type) {
		case map[string]interface{}:
			fmt.Println("Index:", i)
			parseMap(val.(map[string]interface{}))
		case []interface{}:
			fmt.Println("Index:", i)
			parseArray(val.([]interface{}))
		default:
			fmt.Println("Index", i, ":", concreteVal)

		}
	}
}

func TestHumanize(t *testing.T) {

	jsonFile, err := ioutil.ReadFile("testJson.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}

	m := map[string]interface{}{}

	// Parsing/Unmarshalling JSON encoding/json
	err = json.Unmarshal([]byte(jsonFile), &m)

	if err != nil {
		panic(err)
	}
	parseMap(m)

	//fmt.Println(Map(name{AA: "hey", BB: "hey", CC: "hey", DD: "hey"}))

}
