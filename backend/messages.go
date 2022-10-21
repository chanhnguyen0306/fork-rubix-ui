package backend

import (
	"context"
	"fmt"
	"time"

	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/times/utilstime"
	log "github.com/sirupsen/logrus"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type busTopic string

const (
	okMsg  busTopic = "ok"
	errMsg busTopic = "err"
)

func (inst *App) uiSuccessMessage(data interface{}) {
	log.Infof("%s", data)
	inst.msgToUI(inst.ctx, string(okMsg), data)
}

func (inst *App) uiErrorMessage(data interface{}) {
	log.Errorf("%s", data)
	inst.msgToUI(inst.ctx, string(errMsg), data)
}

func (inst *App) sendTimeToUI(ctx context.Context) {
	for {
		time.Sleep(time.Millisecond * 5000)
		fmt.Println("sendTimeToUI")
		inst.msgToUI(ctx, "os-time", utilstime.TimeStamp())
	}
}

func (inst *App) msgToUI(ctx context.Context, topic string, data interface{}) {
	if ctx != nil {
		runtime.EventsEmit(ctx, topic, data)
	}
}

func (inst *App) msgFromUI() {
	if inst.ctx != nil {
		runtime.EventsOn(inst.ctx, "terminal-echo", func(optionalData ...interface{}) {
			fmt.Println("Event from UI to backend data: ", optionalData)
		})
	}
}
