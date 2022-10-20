package backend

import (
	"testing"
)

func TestApp_GetHostTime(t *testing.T) {
	app := NewApp()
	app.GetHostTime("cloud", "rc")
}
