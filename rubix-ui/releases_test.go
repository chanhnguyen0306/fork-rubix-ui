package main

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"testing"
)

func TestApp_AddRelease(t *testing.T) {
	token := git.DecodeToken("Z2hwX2pDU0tteWxrVjkzN1Z5NmFFUHlPVFpObEhoTEdITjBYemxkSA==")
	fmt.Printf("%q\n", token)

	path := "flow/v0.6.1.json"
	app := NewApp()
	release, err := app.addRelease(token, path)
	if err != nil {
		return
	}
	fmt.Println(release)
}
