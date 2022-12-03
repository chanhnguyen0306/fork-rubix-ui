package rumodel

import (
	"context"
	"fmt"
	"github.com/NubeIO/rubix-ui/backend/utils/message"
)

type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func Success(ctx context.Context, data interface{}) *Response {
	message.UiSuccessMessage(ctx, data)
	return SuccessResponse(data)
}

func Fail(ctx context.Context, msg interface{}) *Response {
	message.UiErrorMessage(ctx, msg)
	return FailResponse(msg)
}

func SuccessResponse(data interface{}) *Response {
	return &Response{
		Code: 0,
		Data: data,
	}
}

func FailResponse(msg interface{}) *Response {
	return &Response{
		Code: -1,
		Msg:  fmt.Sprintf("%s", msg),
	}
}
