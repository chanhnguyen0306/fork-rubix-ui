package storage

type Connection struct {
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
