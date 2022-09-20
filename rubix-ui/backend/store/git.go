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

func intNil(b *int64) int64 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func stringIsNil(b *string) string {
	if b == nil {
		return ""
	} else {
		return *b
	}
}

func (inst *Store) GitDownloadWires(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
	if token == "" {
		return errors.New("git token can not be empty")
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
		return err
	}
	assetName := download.AssetName
	log.Infof("git downloaded-wires full asset name: %s", assetName)
	return err
}

func (inst *Store) GitDownload(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
	if token == "" {
		return errors.New("git token can not be empty")
	}
	opts := &git.AssetOptions{
		Owner: inst.Owner,
		Repo:  repo,
		Tag:   version,
		Arch:  arch,
	}
	ctx := context.Background()
	gitClient = git.NewClient(token, opts, ctx)
	assetInfo, err := gitClient.MatchAssetInfo(gitOptions)
	if err != nil {
		return err
	}
	if assetInfo == nil {
		return errors.New("asset info was empty")
	}
	if assetInfo.RepositoryRelease == nil {
		return errors.New("store-download-app failed to match info")
	}
	assetName := stringIsNil(assetInfo.RepositoryRelease.Name)
	dest := path.Join(gitOptions.DownloadDestination, assetName)
	err = gitClient.DownloadRelease(opts.Owner, opts.Repo, dest, intNil(assetInfo.RepositoryRelease.ID))
	if err != nil {
		return err
	}

	log.Infof("git downloaded full asset name: %s", assetName)
	return err
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
