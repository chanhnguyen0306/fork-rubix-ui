package main

import (
	"context"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/times/utilstime"
	"github.com/NubeIO/rubix-assist-client/nube/assist"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
	app.sendTimeToUI(ctx)
}

//initRest get rest client
func (app *App) initRest() *assist.Client {
	return assist.New("164.92.222.81", 8080)
}

func (app *App) sendTimeToUI(ctx context.Context) {
	for {
		time.Sleep(time.Millisecond * 5000)
		fmt.Println("sendTimeToUI")
		app.msgToUI(ctx, "os-time", utilstime.TimeStamp())
	}
}

func (app *App) msgToUI(ctx context.Context, topic string, data interface{}) {
	if ctx != nil {
		runtime.EventsEmit(ctx, topic, data)
	}
}

func (app *App) msgFromUI() {
	if app.ctx != nil {
		runtime.EventsOn(app.ctx, "terminal-echo", func(optionalData ...interface{}) {
			fmt.Println("Event from UI to backend data: ", optionalData)
		})
	}
}
