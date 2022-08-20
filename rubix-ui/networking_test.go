package main

import (
	"testing"
)

func TestApp_GetHostInterfaces(t *testing.T) {
	app := NewApp()

	app.GetHostInterfaces("cloud", "rc")
}
