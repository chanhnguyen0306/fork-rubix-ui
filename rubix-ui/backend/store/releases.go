package store

import (
	"context"
	"encoding/json"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
)

type Release struct {
	Uuid                string   `json:"uuid"`
	Name                string   `json:"name"`
	Repo                string   `json:"repo"`
	MinVersion          string   `json:"min_version"`
	Release             string   `json:"release"`
	Port                int      `json:"port"`
	Transport           string   `json:"transport"`
	Products            []string `json:"products"`
	Arch                []string `json:"arch"`
	AppSpecficExecStart string   `json:"app_specfic_exec_start"`
	Apps                []struct {
		Name                   string   `json:"name"`
		Repo                   string   `json:"repo"`
		Description            string   `json:"description"`
		Port                   int      `json:"port,omitempty"`
		Transport              string   `json:"transport"`
		Products               []string `json:"products"`
		Arch                   []string `json:"arch"`
		Version                string   `json:"version"`
		MinVersion             string   `json:"min_version,omitempty"`
		MaxVersion             string   `json:"max_version"`
		FlowDependency         bool     `json:"flow_dependency"`
		PluginDependency       []string `json:"plugin_dependency"`
		ServiceDependency      []string `json:"service_dependency"`
		CustomServiceExecStart string   `json:"custom_service_exec_start,omitempty"`
	} `json:"apps"`
	Plugins []struct {
		Name              string   `json:"name"`
		Plugin            string   `json:"plugin"`
		Description       string   `json:"description"`
		Products          []string `json:"products"`
		Arch              []string `json:"arch"`
		AppDependency     []string `json:"app_dependency"`
		PluginDependency  []string `json:"plugin_dependency"`
		ServiceDependency []string `json:"service_dependency"`
		Port              int      `json:"port,omitempty"`
		Transport         string   `json:"transport,omitempty"`
	} `json:"plugins"`
	Services []struct {
		Name        string   `json:"name"`
		ServiceName string   `json:"service_name"`
		Description string   `json:"description"`
		Port        int      `json:"port"`
		Transport   string   `json:"transport"`
		Products    []string `json:"products"`
		Arch        []string `json:"arch"`
	} `json:"services"`
}

type Releases struct {
	Releases []Release `json:"releases"`
}

type ReleaseList struct {
	Name string `json:"name"`
	Path string `json:"path"`
	URL  string `json:"url"`
}

//DownLoadReleases pass in the path: "flow/v0.6.1.json"
func (inst *Store) DownLoadReleases(token, path string) (*Release, error) {
	opts := &git.AssetOptions{
		Owner: "NubeIO",
		Repo:  "releases",
		Tag:   "latest",
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)

	contents, _, _, err := gitClient.GetContents("NubeIO", "releases", path, &github.RepositoryContentGetOptions{})
	if err != nil {
		return nil, err
	}

	content, err := contents.GetContent()
	if err != nil {
		return nil, err
	}
	var r *Release
	err = json.Unmarshal([]byte(content), &r)
	return r, err
}
