package backend

import (
	"github.com/NubeIO/rubix-ui/backend/rumodel"
	"github.com/NubeIO/rubix-ui/backend/utils/message"
)

func (inst *App) uiSuccessMessage(data interface{}) {
	message.UiSuccessMessage(inst.ctx, data)
}

func (inst *App) uiWarningMessage(data interface{}) {
	message.UiWarningMessage(inst.ctx, data)
}

func (inst *App) uiErrorMessage(data interface{}) {
	message.UiErrorMessage(inst.ctx, data)
}

func (inst *App) success(data interface{}) *rumodel.Response {
	return rumodel.Success(inst.ctx, data)
}

func (inst *App) fail(data interface{}) *rumodel.Response {
	return rumodel.Fail(inst.ctx, data)
}

// successResponse it just response the succeeded message without printing log
func (inst *App) successResponse(data interface{}) *rumodel.Response {
	return rumodel.SuccessResponse(data)
}

// failResponse it just response the failed message without printing log
func (inst *App) failResponse(data interface{}) *rumodel.Response {
	return rumodel.FailResponse(data)
}
