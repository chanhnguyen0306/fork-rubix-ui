package store

import (
	"context"
	"encoding/base64"
	"errors"
	"github.com/NubeIO/git/pkg/git"
	log "github.com/sirupsen/logrus"
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

func encodeToken(token string) string {
	return base64.StdEncoding.EncodeToString([]byte(token))
}

func decodeToken(token string) string {
	data, _ := base64.StdEncoding.DecodeString(token)
	return string(data)

}
