import {model} from "../../../../wailsjs/go/models";
import {DisablePlugin, EnablePlugin, GetPlugins} from "../../../../wailsjs/go/main/App";
import {Helpers} from "../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowPluginFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;

    async GetAll(): Promise<Array<model.PluginConf>> {
        let all: Promise<Array<model.PluginConf>> = {} as Promise<Array<model.PluginConf>>
        await GetPlugins(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.PluginConf>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async Enable(): Promise<any> {
        hasUUID(this.uuid)
        let out: Promise<any> = {} as Promise<any>
        await EnablePlugin(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }

    async Disable(): Promise<any> {
        hasUUID(this.uuid)
        let out: Promise<any> = {} as Promise<any>
        await DisablePlugin(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }


}