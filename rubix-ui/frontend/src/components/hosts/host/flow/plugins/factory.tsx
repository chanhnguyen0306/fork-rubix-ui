import {backend, model} from "../../../../../../wailsjs/go/models";
import {
  DisablePluginBulk,
  EnablePluginBulk,
  GetPlugins, RestartPluginBulk,
} from "../../../../../../wailsjs/go/backend/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowPluginFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;

    async GetAll(): Promise<Array<model.PluginConf>> {
        let resp: Promise<Array<model.PluginConf>> = {} as Promise<Array<model.PluginConf>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetPlugins(this.connectionUUID, this.hostUUID).then(res => {
            resp = res as unknown as Promise<Array<model.PluginConf>>
        }).catch(err => {
            return resp
        })
        return resp
    }

    async BulkEnable(pluginUUIDs: Array<backend.PluginUUIDs>): Promise<any> {
        let resp: Promise<any> = {} as Promise<any>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await EnablePluginBulk(this.connectionUUID, this.hostUUID, pluginUUIDs).then(res => {
            resp = res as Promise<any>
        }).catch(err => {
            return resp
        })
        return resp
    }

    async BulkDisable(pluginUUIDs: Array<backend.PluginUUIDs>): Promise<any> {
        let resp: Promise<any> = {} as Promise<any>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await DisablePluginBulk(this.connectionUUID, this.hostUUID, pluginUUIDs).then(res => {
            resp = res as Promise<any>
        }).catch(err => {
            return resp
        })
        return resp
    }

  async RestartBulk(pluginUUIDs: Array<backend.PluginUUIDs>): Promise<any> {
    let resp: Promise<any> = {} as Promise<any>
    hasUUID(this.connectionUUID)
    hasUUID(this.hostUUID)
    await RestartPluginBulk(this.connectionUUID, this.hostUUID, pluginUUIDs).then(res => {
      resp = res as Promise<any>
    }).catch(err => {
      return resp
    })
    return resp
  }
}
