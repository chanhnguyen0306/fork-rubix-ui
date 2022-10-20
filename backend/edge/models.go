package edge

type InternetIP struct {
	IpAddress string `json:"ip_address"`
	Ok        bool   `json:"ok"`
}

type InterfaceNames struct {
	InterfaceNames []string `json:"interface_names"`
}

type SetIpDHCP struct {
	Interface        string `json:"interface"`
	ConfirmInterface bool   `json:"confirm_interface"`
}

type SetIpStatic struct {
	Interface        string `json:"interface"`
	ConfirmInterface bool   `json:"confirm_interface"`
	IpAddress        string `json:"ip_address"`
	Netmask          string `json:"netmask"`
	Gateway          string `json:"gateway"`
}
