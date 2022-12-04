package rumodel

type Plugin struct {
	UUID         string   `json:"uuid"`
	Name         string   `json:"name"`
	ModulePath   string   `json:"module_path"`
	Author       string   `json:"author"`
	Website      string   `json:"website"`
	Enabled      bool     `json:"enabled"`
	HasNetwork   bool     `json:"has_network"`
	Capabilities []string `json:"capabilities"`
}
