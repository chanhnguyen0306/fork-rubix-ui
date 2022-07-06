import {main, model} from "../../../../../../wailsjs/go/models";
import {DisablePluginBulk, EnablePluginBulk, GetPlugins} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowPluginFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;

    async GetAll(): Promise<Array<model.PluginConf>> {
        let all: Promise<Array<model.PluginConf>> = {} as Promise<Array<model.PluginConf>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetPlugins(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.PluginConf>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async BulkEnable(pluginUUIDs: Array<main.PluginUUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await EnablePluginBulk(this.connectionUUID, this.hostUUID, pluginUUIDs).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }

    async BulkDisable(pluginUUIDs: Array<main.PluginUUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await DisablePluginBulk(this.connectionUUID, this.hostUUID, pluginUUIDs).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }


}