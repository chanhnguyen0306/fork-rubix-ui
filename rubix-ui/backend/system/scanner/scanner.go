package scanner

import (
	"fmt"
	"github.com/NubeIO/lib-networking/networking"
	"github.com/NubeIO/lib-networking/scanner"
	"github.com/NubeIO/lib-schema/schema"
)

type T struct {
	Ip    string `json:"ip"`
	Ports []struct {
		Service string `json:"service"`
		Port    string `json:"port"`
	} `json:"ports"`
}

type count struct {
	Type    string `json:"type" default:"number"`
	Title   string `json:"title" default:"count"`
	Min     int    `json:"minLength" default:"1"`
	Max     int    `json:"maxLength" default:"254"`
	Default int    `json:"default" default:"254"`
}

type Schema struct {
	Count     count            `json:"count"`
	IP        schema.IP        `json:"ip"`
	Interface schema.Interface `json:"interface"`
}

var nets = networking.New()

func BuildSchema() *Schema {
	m := &Schema{}
	names, err := nets.GetInterfacesNames()
	if err != nil {
		return nil
	}
	m.Interface.Options = names.Names
	schema.Set(m)
	return m
}

func RunScanner(iface, ip string, count int, ports []string) (*scanner.Hosts, error) {
	if count > 254 {
		count = 254
	}
	if count <= 0 {
		count = 254
	}
	if len(ports) == 0 {
		ports = []string{"22", "1414", "1883", "1666", "502", "1313", "1660", "1661", "1662", "1663"}
	}
	scan := scanner.New()
	address, err := scan.ResoleAddress(ip, count, iface)
	if err != nil {
		return nil, err
	}
	fmt.Println(address, ports, len(ports))
	host := scan.IPScanner(address, ports, true)
	return host, nil
}
