package main

import (
	"fmt"
	"github.com/NubeIO/lib-schema/schema"
	"github.com/NubeIO/rubix-ui/backend/storage"
	"github.com/NubeIO/rubix-ui/backend/storage/logstore"
)

type ConnectionSchema struct {
	UUID        schema.UUID        `json:"uuid"`
	Name        schema.Name        `json:"name"`
	Description schema.Description `json:"description"`
	IP          schema.IP          `json:"ip"`
	Port        schema.Port        `json:"port"`
	HTTPS       schema.HTTPS       `json:"https"`
	Username    schema.Username    `json:"username"`
	Password    schema.Password    `json:"password"`
}

func connectionSchema() *ConnectionSchema {
	m := &ConnectionSchema{}
	schema.Set(m)
	return m
}

func (inst *App) GetConnectionSchema() *ConnectionSchema {
	c := connectionSchema()
	return c
}

func (inst *App) GetConnection(uuid string) *storage.RubixConnection {
	conn, err := inst.DB.Select(uuid)
	if err != nil {
		return nil
	}
	return conn
}

func (inst *App) GetConnections() []storage.RubixConnection {
	conn, err := inst.DB.SelectAll()
	if err != nil {
		return nil
	}
	return conn
}

func (inst *App) AddConnection(conn *storage.RubixConnection) *storage.RubixConnection {
	conn, err := inst.DB.Add(conn)
	if err != nil {
		return nil
	}
	return conn
}

func (inst *App) UpdateConnection(uuid string, conn *storage.RubixConnection) *storage.RubixConnection {
	connection, err := inst.DB.Select(uuid)
	if err != nil {
		inst.crudMessage(false, fmt.Sprintf("error %s", err.Error()))
		return nil
	}
	inst.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Update.String(),
		Data:     connection,
	})
	conn, err = inst.DB.Update(uuid, conn)
	if err != nil {
		return nil
	}
	return conn
}

func (inst *App) DeleteConnectionBulk(uuids []UUIDs) interface{} {

	for _, item := range uuids {
		msg, err := inst.deleteConnection(item.UUID)
		if err != nil {
			inst.crudMessage(false, fmt.Sprintf("delete network %s %s", item.Name, msg))
		} else {
			inst.crudMessage(true, fmt.Sprintf("deleteed network: %s", item.Name))
		}
	}
	return "ok"
}

func (inst *App) deleteConnection(uuid string) (string, error) {
	connection, err := inst.DB.Select(uuid)
	if err != nil {
		return "failed to find connection to backup", err
	}
	_, err = inst.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Delete.String(),
		Data:     connection,
	})
	if err != nil {
		return "", err
	}
	err = inst.DB.Delete(uuid)
	if err != nil {
		return "", err
	}
	return "deleted ok", nil
}

func (inst *App) DeleteConnection(uuid string) string {
	connection, err := inst.DB.Select(uuid)
	if err != nil {
		return "failed to find connection to backup"
	}
	inst.DB.AddLog(&storage.Log{
		Function: logstore.Connection.String(),
		Type:     logstore.Delete.String(),
		Data:     connection,
	})
	err = inst.DB.Delete(uuid)
	if err != nil {
		return err.Error()
	}
	return "deleted ok"
}

type DeleteAllConnections struct {
	CountDeleted int
	Error        string
}

func (inst *App) DeleteAllConnections() *DeleteAllConnections {
	resp := &DeleteAllConnections{}
	count, err := inst.DB.Wipe()
	resp.CountDeleted = count
	if err != nil {
		resp.Error = err.Error()
		return resp
	}
	return resp
}
