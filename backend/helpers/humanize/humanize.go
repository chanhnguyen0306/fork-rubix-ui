package humanize

import (
	"github.com/iancoleman/strcase"
	"github.com/stretchr/objx"
	"github.com/tidwall/gjson"
	"reflect"
	"strings"
	"unicode"
)

type Out struct {
	Title string      `json:"title"`
	Key   string      `json:"key"`
	Index string      `json:"dataIndex"`
	Data  interface{} `json:"data,omitempty"`
}

type TableSchema struct {
	Title string `json:"title"`
	Key   string `json:"key"`
	Index string `json:"dataIndex"`
}

func BuildTableSchema(data interface{}) []TableSchema {
	var schema []TableSchema
	elementMap := make(map[string]TableSchema)
	for i, value := range objx.New(data) {
		v := objx.New(value)
		title := ""
		key := i
		index := key
		for k, v := range v {
			if k == "title" {
				title = v.(string)
			}
		}
		elementMap[i] = TableSchema{Title: title, Key: key, Index: index}
		schema = append(schema, TableSchema{Title: title, Key: key, Index: index})
	}
	return schema
}

func Map(data []byte, incData ...bool) *[]Out {
	value := gjson.ParseBytes(data)
	val := reflect.ValueOf(value.Value())
	var res []Out
	if val.Kind() == reflect.Map {
		for _, e := range val.MapKeys() {
			v := val.MapIndex(e)
			switch t := v.Interface().(type) {
			case int:
			case string:
				if len(incData) > 0 {
					res = append(res, Out{Key: e.String(), Index: e.String(), Title: toTitleCase(e.String()), Data: t})
				} else {
					res = append(res, Out{Key: e.String(), Index: e.String(), Title: toTitleCase(e.String())})
				}
			case bool:
			default:

			}
		}
	}
	return &res
}

func ArrayOfMaps(data []byte, incData ...bool) *[]Out {
	value := gjson.ParseBytes(data)
	val := reflect.ValueOf(value.Value())
	var res []Out
	if val.Kind() == reflect.Slice {
		for i := 0; i < val.Len(); i++ {
			if val.Index(i).Kind() == reflect.Interface {
				maps := val.Index(i).Elem()
				if maps.Kind() == reflect.Map {
					for _, e := range maps.MapKeys() {
						v := maps.MapIndex(e)
						switch t := v.Interface().(type) {
						case int:
						case string:
							if len(incData) > 0 {
								res = append(res, Out{Key: e.String(), Index: e.String(), Title: toTitleCase(e.String()), Data: t})
							} else {
								res = append(res, Out{Key: e.String(), Index: e.String(), Title: toTitleCase(e.String())})
							}
						case bool:
						default:

						}
					}
				}
			}
		}

	}
	return &res
}

func isWhitespace(r rune) bool {
	result := false
	switch r {
	case
		'\u0009', // horizontal tab
		'\u000A', // line feed
		'\u000B', // vertical tab
		'\u000C', // form feed
		'\u000D', // carriage return
		'\u0020', // space
		'\u0085', // next line
		'\u00A0', // no-break space
		'\u1680', // ogham space mark
		'\u180E', // mongolian vowel separator
		'\u2000', // en quad
		'\u2001', // em quad
		'\u2002', // en space
		'\u2003', // em space
		'\u2004', // three-per-em space
		'\u2005', // four-per-em space
		'\u2006', // six-per-em space
		'\u2007', // figure space
		'\u2008', // punctuation space
		'\u2009', // thin space
		'\u200A', // hair space
		'\u2028', // line separator
		'\u2029', // paragraph separator
		'\u202F', // narrow no-break space
		'\u205F', // medium mathematical space
		'\u3000': // ideographic space
		result = true
	default:
		result = false
	}
	return result
}

func toTitleCase(s string) string {
	prev := ' '
	s = strings.Replace(strcase.ToSnake(s), "_", " ", -1)
	result := strings.Map(
		func(r rune) rune {
			if isWhitespace(prev) || '_' == prev || '-' == prev {
				prev = r
				return unicode.ToTitle(r)
			} else {
				prev = r
				return unicode.ToLower(r)
			}
		},
		s)
	return result
}
