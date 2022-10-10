package store

import (
	"errors"
	"fmt"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"io/ioutil"
)

// StoreListPlugins get all plugins for a version => ~/rubix/store/apps/flow-framework/<armv7|amd64>/v0.0.1/plugins
func (inst *Store) StoreListPlugins(arch, version string) ([]installer.BuildDetails, string, error) {
	pluginStore := inst.GetAppStoreAppPluginsPath(flow, arch, version)
	err := fileutils.New().DirExistsErr(pluginStore)
	if err != nil {
		return nil, "", errors.New(fmt.Sprintf("failed to find plugin by version: %s", version))
	}
	files, err := ioutil.ReadDir(pluginStore)
	if err != nil {
		return nil, "", err
	}
	var plugins []installer.BuildDetails
	for _, file := range files {
		plugins = append(plugins, *inst.App.GetZipBuildDetails(file.Name()))
	}
	return plugins, pluginStore, err
}
