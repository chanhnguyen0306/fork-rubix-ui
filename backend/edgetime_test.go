package backend

import (
	"testing"
)

func TestApp_GetHostTime(t *testing.T) {
	app := MockNewApp()
	app.GetHostTime("cloud", "rc")
}
