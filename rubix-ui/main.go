package main

import (
	"embed"
	"fmt"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"os/exec"
	"runtime"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	AppMenu := menu.NewMenu()

	FileMenu := AppMenu.AddSubmenu("Options")
	FileMenu.AddSeparator()
	FileMenu.AddText("Reload", keys.CmdOrCtrl("r"), func(_ *menu.CallbackData) {
		app.reload()
	})
	FileMenu.AddText("Help", keys.CmdOrCtrl("h"), func(_ *menu.CallbackData) {
		app.nubeHelp()
	})
	FileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		app.quit()
	})

	err := wails.Run(&options.App{
		Title:       "rubix",
		Width:       950,
		Height:      650,
		Assets:      assets,
		StartHidden: false,
		Menu:        AppMenu,
		OnStartup:   app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err)
	}
}

func (app *App) reload() {
	wailsruntime.WindowReloadApp(app.ctx)
}

func (app *App) quit() {
	wailsruntime.Quit(app.ctx)
}

func (app *App) nubeHelp() {
	url := "https://desk.zoho.com.au/portal/nubeio/en/home"
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("cmd", "/c", "start", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	fmt.Println(err)
}
