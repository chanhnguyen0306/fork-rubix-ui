package storage

import (
	"time"
)

type Backup struct {
	UUID           string      `json:"uuid"`
	ConnectionUUID string      `json:"connection_uuid"`
	UserComment    string      `json:"user_comment"`
	HostUUID       string      `json:"host_uuid"`
	HostName       string      `json:"host_name"`
	Time           time.Time   `json:"time"`
	Application    string      `json:"application"`
	Data           interface{} `json:"data,omitempty"`
}

type Log struct {
	UUID     string      `json:"uuid"`
	Time     time.Time   `json:"time"`
	Function string      `json:"function"`
	Type     string      `json:"type"`
	HasData  bool        `json:"has_data"`
	Data     interface{} `json:"data,omitempty"`
}

type RubixConnection struct {
	UUID        string `json:"uuid"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Customer    string `json:"customer"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	IP          string `json:"ip"`
	Port        int    `json:"port"`
	HTTPS       bool   `json:"https"`
}
