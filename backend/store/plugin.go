package store

import (
	"github.com/NubeIO/rubix-ui/backend/helpers/builds"
	"io/ioutil"
)

// StoreListPlugins get all plugins for a version => ~/rubix/store/plugins
func (inst *AppStore) StoreListPlugins() ([]builds.BuildDetails, string, error) {
	files, err := ioutil.ReadDir(inst.Store.UserPluginPath)
	if err != nil {
		return nil, "", err
	}
	var plugins []builds.BuildDetails
	for _, file := range files {
		plugins = append(plugins, *builds.GetZipBuildDetails(file.Name()))
	}
	return plugins, inst.Store.UserPluginPath, err
}
