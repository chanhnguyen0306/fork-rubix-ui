package store

import (
	"context"
	"errors"
	"github.com/NubeIO/git/pkg/git"
	log "github.com/sirupsen/logrus"
	"path"
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

func (inst *AppStore) gitDownloadZipball(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
	opts := &git.AssetOptions{
		Owner: inst.Store.Owner,
		Repo:  repo,
		Tag:   version,
		Arch:  arch,
	}
	ctx := context.Background()
	gitClient := git.NewClient(token, opts, ctx)
	download, err := gitClient.DownloadZipball(gitOptions)
	if err != nil {
		return err
	}
	assetName := download.AssetName
	log.Infof("git downloaded assest: %s", assetName)
	return err
}

func (inst *AppStore) gitDownloadAsset(repo, version, arch, token string, gitOptions git.DownloadOptions) error {
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
	gitClient := git.NewClient(token, opts, ctx)
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

	log.Infof("git downloaded assest: %s", assetName)
	return err
}
