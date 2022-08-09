package main

import (
	"context"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/times/utilstime"
	log "github.com/sirupsen/logrus"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"time"
)

type busTopic string

const (
	okMsg  busTopic = "ok"
	errMsg busTopic = "err"
)

func (app *App) crudMessage(ok bool, data interface{}) {
	if ok {
		log.Infof("mesage %s", data)
		app.msgToUI(app.ctx, string(okMsg), data)
	} else {
		log.Errorf("error %s", data)
		app.msgToUI(app.ctx, string(errMsg), data)
	}

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
