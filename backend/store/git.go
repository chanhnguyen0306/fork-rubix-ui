package store

import (
	"context"
	"encoding/base64"
	"errors"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
	log "github.com/sirupsen/logrus"
	"path"
	"strings"
)

func intPtrToInt(b *int64) int64 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func stringPtrToString(b *string) string {
	if b == nil {
		return ""
	} else {
		return *b
	}
}

func (inst *AppStore) GitDownloadZipball(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
	if token == "" {
		return errors.New("git token can not be empty")
	}
	opts := &git.AssetOptions{
		Owner: inst.Store.Owner,
		Repo:  repo,
		Tag:   version,
		Arch:  arch,
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)
	download, err := gitClient.DownloadZipball(gitOptions)
	if err != nil {
		return err
	}
	assetName := download.AssetName
	log.Infof("git downloaded: %s", assetName)
	return err
}

func (inst *AppStore) GitDownloadAsset(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
	if token == "" {
		return errors.New("git token can not be empty")
	}
	opts := &git.AssetOptions{
		Owner: inst.Store.Owner,
		Repo:  repo,
		Tag:   version,
		Arch:  arch,
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)
	releaseAsset, err := gitClient.GetReleaseAsset(gitOptions)
	if err != nil {
		return err
	}
	if releaseAsset == nil {
		return errors.New("release asset is empty")
	}
	assetName := stringPtrToString(releaseAsset.Name)
	destination := path.Join(gitOptions.DownloadDestination, assetName)
	err = gitClient.DownloadReleaseAsset(opts.Owner, opts.Repo, destination, intPtrToInt(releaseAsset.ID))
	if err != nil {
		return err
	}

	log.Infof("git downloaded: %s", assetName)
	return err
}

func (inst *AppStore) GitListReleases(token string) ([]ReleaseList, error) {
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
