package store

import (
	"context"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
	"strings"
)

type Release struct {
	Name    string `json:"name"`
	Repo    string `json:"repo"`
	Release string `json:"release"`
	Apps    []struct {
		Name             string   `json:"name"`
		Repo             string   `json:"repo"`
		Description      string   `json:"description"`
		Products         []string `json:"products"`
		Versions         []string `json:"versions"`
		FlowDependency   bool     `json:"flow_dependency"`
		PluginDependency string   `json:"plugin_dependency"`
	} `json:"apps"`
}

type Releases struct {
	Releases []Release `json:"releases"`
}

type ReleaseList struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

func (inst *Store) Releases(token string) ([]ReleaseList, error) {
	var list []ReleaseList
	opts := &git.AssetOptions{
		Owner: "NubeIO",
		Repo:  "releases",
		Tag:   "latest",
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)
	_, i, _, err := gitClient.GetContents("NubeIO", "releases", "flow", &github.RepositoryContentGetOptions{})
	if err != nil {
		return nil, err
	}
	for _, content := range i {
		name := strings.ReplaceAll(*content.Name, ".json", "")
		newList := ReleaseList{
			Name: name,
			URL:  *content.DownloadURL,
		}
		list = append(list, newList)
	}
	return list, err
}
