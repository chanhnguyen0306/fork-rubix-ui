package backend

import (
	"fmt"
	"testing"
)

func TestApp_GetRubixEdgeVersions(t *testing.T) {
	app := MockNewApp()
	releases := app.EdgeBiosGetRubixEdgeVersions()
	fmt.Println("releases", releases)
}
