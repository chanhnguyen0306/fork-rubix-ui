package backend

import (
	"github.com/NubeIO/lib-rubix-installer/installer"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/store"
	log "github.com/sirupsen/logrus"
)

func MockNewApp() *App {
	app := &App{}
	app.DB = storage.New("../data/data.db")
	appStore, err := store.New(&store.Store{}, installer.New(&installer.App{}))
	if err != nil {
		log.Fatalf("init appStore on start of app err: %s", err.Error())
	}
	app.appStore = appStore
	return app
}
