package main

import (
	"context"
	"fmt"
	"github.com/NubeIO/nubeio-rubix-lib-helpers-go/pkg/nube/nube"
	"github.com/NubeIO/rubix-assist-client/nube/assist"
	"github.com/NubeIO/rubix-assist-client/rest"
	"github.com/NubeIO/rubix-assist-model/model"
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
}

// Greet returns a greeting for the given name
func (app *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (app *App) initRest() *assist.Client {

	restService := &rest.Service{}
	restService.Url = "0.0.0.0"
	restService.Port = 8080
	restOptions := &rest.Options{}
	restService.Options = restOptions
	restService = rest.New(restService)

	nubeProxy := &rest.NubeProxy{}
	nubeProxy.UseRubixProxy = false
	nubeProxy.RubixUsername = "admin"
	nubeProxy.RubixPassword = "N00BWires"
	nubeProxy.RubixProxyPath = nube.Services.RubixService.Proxy
	restService.NubeProxy = nubeProxy
	return assist.New(restService)

}

func (app *App) AddHost(host *model.Host) (resp *model.Host) {
	client := app.initRest()
	resp, res := client.AddHost(host)
	fmt.Println(res.GetStatus())
	return
}

func (app *App) GetHosts() (hosts []*model.Host) {
	//hosts = []*model.Host{}
	client := app.initRest()
	hosts, res := client.GetHosts()
	fmt.Println(res.GetStatus())
	return
}
