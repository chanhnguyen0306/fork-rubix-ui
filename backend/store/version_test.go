package store

import (
	"fmt"
	"github.com/NubeIO/git/pkg/git"
	"github.com/NubeIO/lib-rubix-installer/installer"
	"testing"
)

func TestApp_edgeReadConfigWires(t *testing.T) {
	appStore, _ := New(&Store{}, installer.New(&installer.App{}))
	releases, err := appStore.GetRubixEdgeVersions(git.DecodeToken(token))
	fmt.Println("releases", releases)
	fmt.Println("err", err)
}
