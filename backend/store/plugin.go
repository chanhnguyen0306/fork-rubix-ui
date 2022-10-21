package store

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
	"io/ioutil"
)

// StoreListPlugins get all plugins for a version => ~/rubix/store/plugins
func (inst *store) StoreListPlugins() ([]installer.BuildDetails, string, error) {
	files, err := ioutil.ReadDir(inst.Store.UserPluginPath)
	if err != nil {
		return nil, "", err
	}
	var plugins []installer.BuildDetails
	for _, file := range files {
		plugins = append(plugins, *inst.App.GetZipBuildDetails(file.Name()))
	}
	return plugins, inst.Store.UserPluginPath, err
}
