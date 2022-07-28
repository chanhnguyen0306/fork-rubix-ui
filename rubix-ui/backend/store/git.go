package store

import (
	"context"
	"encoding/base64"
	"errors"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
	log "github.com/sirupsen/logrus"
	"strings"
)

func (inst *Store) GitDownload(repo, version, arch, token string, gitOptions git.DownloadOptions) (*git.DownloadResponse, error) {
	if token == "" {
		return nil, errors.New("git token can not be empty")
	}
	opts := &git.AssetOptions{
		Owner: inst.Owner,
		Repo:  repo,
		Tag:   version,
		Arch:  arch,
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)
	download, err := gitClient.Download(gitOptions)
	if err != nil {
		return nil, err
	}
	assetName := download.AssetName
	log.Infof("git downloaded full asset name: %s", assetName)
	return download, err
}

func (inst *Store) GitListReleases(token string) ([]ReleaseList, error) {
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
			Path: *content.Path,
			URL:  *content.DownloadURL,
		}
		list = append(list, newList)
	}
	return list, err
}

func encodeToken(token string) string {
	return base64.StdEncoding.EncodeToString([]byte(token))
}

func decodeToken(token string) string {
	data, _ := base64.StdEncoding.DecodeString(token)
	return string(data)

}
