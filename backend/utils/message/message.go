package message

import (
	"context"
	"fmt"
	log "github.com/sirupsen/logrus"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type BusTopic string

const (
	OkMsg   BusTopic = "ok"
	WarnMsg BusTopic = "warn"
	ErrMsg  BusTopic = "err"
)

func UiSuccessMessage(ctx context.Context, data interface{}) {
	message := fmt.Sprintf("%s", data)
	log.Infof(message)
	msgToUI(ctx, string(OkMsg), message)
}

func UiWarningMessage(ctx context.Context, data interface{}) {
	message := fmt.Sprintf("%s", data)
	log.Warnf(message)
	msgToUI(ctx, string(WarnMsg), message)
}

func UiErrorMessage(ctx context.Context, data interface{}) {
	message := fmt.Sprintf("%s", data)
	log.Errorf(message)
	msgToUI(ctx, string(ErrMsg), message)
}

func msgToUI(ctx context.Context, topic string, data interface{}) {
	if ctx != nil {
		runtime.EventsEmit(ctx, topic, data)
	}
}

func MsgFromUI(ctx context.Context) {
	if ctx != nil {
		runtime.EventsOn(ctx, "terminal-echo", func(optionalData ...interface{}) {
			fmt.Println("Event from UI to backend data: ", optionalData)
		})
	}
}
