package main

import (
	"fmt"
	"testing"
)

func TestApp_assistLogin(t *testing.T) {
	app := NewApp()
	err := app.assistGenerateToken("cloud", true)
	fmt.Println(err)
}

func TestApp_ffProxy(t *testing.T) {
	app := NewApp()
	app.ffProxy("cloud", "rc")
}
