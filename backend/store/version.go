package store

import (
	"context"
	"github.com/NubeIO/git/pkg/git"
	"github.com/google/go-github/v32/github"
	"golang.org/x/oauth2"
)

func (inst *AppStore) GetRubixEdgeVersions(token string) (*[]string, error) {
	const owner = "NubeIO"
	const repo = "rubix-edge"

	c := context.Background()
	tokenSource := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	githubClient := github.NewClient(oauth2.NewClient(c, tokenSource))

	releases, _, err := githubClient.Repositories.ListReleases(c, owner, repo, &git.ListOptions{Page: 1, PerPage: 10})
	if err != nil {
		return nil, err
	}
	releaseOutput := make([]string, 0)
	for _, release := range releases {
		releaseOutput = append(releaseOutput, *release.TagName)
	}
	return &releaseOutput, nil
}
