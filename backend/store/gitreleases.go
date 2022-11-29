package store

import (
	"context"
	"encoding/json"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
	"strings"
)

func (inst *AppStore) GitListReleases(token string) ([]ReleaseList, error) {
	var list []ReleaseList
	opts := &git.AssetOptions{
		Owner: "NubeIO",
		Repo:  "releases",
		Tag:   "latest",
	}
	ctx := context.Background()
	gitClient := git.NewClient(token, opts, ctx)
	_, i, _, err := gitClient.GetContents("NubeIO", "releases", "flow", &github.RepositoryContentGetOptions{})
	if err != nil {
		return nil, err
	}
	for _, content := range i {
		name := strings.ReplaceAll(*content.Name, ".json", "")
		newList := ReleaseList{
			Name: name,
			Path: *content.Path,
			URL:  *content.DownloadURL,
		}
		list = append(list, newList)
	}
	return list, err
}

// GitDownloadRelease pass in the path: "flow/v0.6.1.json"
func (inst *AppStore) GitDownloadRelease(token, path string) (*Release, error) {
	opts := &git.AssetOptions{
		Owner: "NubeIO",
		Repo:  "releases",
		Tag:   "latest",
	}
	ctx := context.Background()
	gitClient := git.NewClient(token, opts, ctx)
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
