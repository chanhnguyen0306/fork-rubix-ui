package storage

type Connection struct {
	Username string
	Password string
	Ip       string
	Port     int
	HTTPS    bool
}

type RubixConnection struct {
	UUID        string      `json:"uuid"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Customer    string      `json:"customer"`
	Connection  *Connection `json:"connection"`
}
