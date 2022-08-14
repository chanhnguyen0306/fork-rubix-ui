package store

import (
	"errors"
	"fmt"
	fileutils "github.com/NubeIO/lib-dirs/dirs"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"io/ioutil"
)

// StoreListPluginsAmd64 get all plugins for a version => /home/user/rubix/store/apps/rubix-wires/v0.0.1
func (inst *Store) StoreListPluginsAmd64(version string) ([]installer.BuildDetails, string, error) {
	flowPath := inst.getAppPathAndVersion(flow, version)
	err := fileutils.New().DirExistsErr(flowPath)
	if err != nil {
		return nil, "", errors.New(fmt.Sprintf("failed to find plugin by version:%s", version))
	}
	pluginStore := fmt.Sprintf("%s/plugins/amd64", flowPath)
	files, err := ioutil.ReadDir(pluginStore)
	if err != nil {
		return nil, "", err
	}
	var plugins []installer.BuildDetails
	for _, file := range files {
		plugins = append(plugins, *inst.assistStore.PluginZipDetails(file.Name()))
	}
	return plugins, pluginStore, err
}

// StoreListPluginsArm get all plugins for a version => /home/user/rubix/store/apps/rubix-wires/v0.0.1
func (inst *Store) StoreListPluginsArm(version string) ([]installer.BuildDetails, string, error) {
	flowPath := inst.getAppPathAndVersion(flow, version)
	err := fileutils.New().DirExistsErr(flowPath)
	if err != nil {
		return nil, "", errors.New(fmt.Sprintf("failed to find plugin by version:%s", version))
	}
	pluginStore := fmt.Sprintf("%s/plugins/armv7", flowPath)
	files, err := ioutil.ReadDir(pluginStore)
	if err != nil {
		return nil, "", err
	}
	var plugins []installer.BuildDetails
	for _, file := range files {
		fmt.Println(file.Name())
		plugins = append(plugins, *inst.assistStore.PluginZipDetails(file.Name()))
	}
	return plugins, pluginStore, err
}
