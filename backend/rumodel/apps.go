package rumodel

type InstalledApps struct {
	AppName             string `json:"app_name,omitempty"`
	Version             string `json:"version,omitempty"`
	LatestVersion       string `json:"latest_version,omitempty"`
	ServiceName         string `json:"service_name,omitempty"`
	InstalledAppVersion string `json:"app_version,omitempty"`
	IsInstalled         bool   `json:"is_installed"`
	Message             string `json:"message,omitempty"`
	Match               bool   `json:"match,omitempty"`
	DowngradeRequired   bool   `json:"downgrade_required,omitempty"`
	UpgradeRequired     bool   `json:"upgrade_required,omitempty"`
	State               string `json:"state,omitempty"`
	ActiveState         string `json:"active_state,omitempty"`
	SubState            string `json:"sub_state,omitempty"`
}

type AppsAvailableForInstall struct {
	AppName       string `json:"app_name,omitempty"`
	LatestVersion string `json:"latest_version,omitempty"`
}

type EdgeDeviceInfo struct {
	InstalledApps           []InstalledApps           `json:"installed_apps,omitempty"`
	AppsAvailableForInstall []AppsAvailableForInstall `json:"apps_available_for_install,omitempty"`
}
