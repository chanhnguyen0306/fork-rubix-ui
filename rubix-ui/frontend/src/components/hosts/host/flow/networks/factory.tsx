import {main, model} from "../../../../../../wailsjs/go/models";
import {
    AddNetwork,
    DeleteNetwork, DeleteNetworkBulk,
    EditNetwork,  GetFlowNetworkSchema,
    GetNetwork,
    GetNetworks
} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowNetworkFactory {
    hostUUID!: string;
    connectionUUID!: string;

    async GetAll(withDevice:boolean): Promise<Array<model.Network>> {
        let resp: Promise<Array<model.Network>> = {} as Promise<Array<model.Network>>
        hasUUID(this.hostUUID)
        await GetNetworks(this.connectionUUID, this.hostUUID, withDevice).then(res => {
          resp = res as unknown as Promise<Array<model.Network>>
        }).catch(err => {
            return resp
        })
        return resp
    }

    async GetOne(uuid:string, withDevice:boolean): Promise<model.Network> {
        let resp: model.Network = {} as model.Network
        await GetNetwork(this.connectionUUID, this.hostUUID, uuid, withDevice).then(res => {
          resp = res as model.Network
        }).catch(resp => {
            return resp
        })
        return resp
    }


    async Add(body: model.Network): Promise<model.Network> {
        let resp: model.Network = {} as model.Network
        await AddNetwork(this.connectionUUID, this.hostUUID, body).then(res => {
          resp = res as model.Network
        }).catch(err => {
            return resp
        })
        return resp
    }

    async Update(uuid:string, body: model.Network): Promise<model.Network> {
        let resp: model.Network = {} as model.Network
        await EditNetwork(this.connectionUUID, this.hostUUID, uuid, body).then(res => {
          resp = res as model.Network
        }).catch(err => {
            return resp
        })
        return resp
    }

    async Delete(uuid:string, ): Promise<model.Network> {
        let resp: model.Network = {} as model.Network
        await DeleteNetwork(this.connectionUUID, this.hostUUID, uuid).then(res => {
          resp = res as model.Network
        }).catch(err => {
            return resp
        })
        return resp
    }

    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        let resp: Promise<any> = {} as Promise<any>
        await DeleteNetworkBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            resp = res as Promise<any>
        }).catch(err => {
            return resp
        })
        return resp
    }


    async Schema(connUUID:string, hostUUID:string, setPluginName:string):Promise<any> {
        let resp: Promise<any> = {} as Promise<any>
        hasUUID(connUUID)
        hasUUID(hostUUID)
        await GetFlowNetworkSchema(connUUID, hostUUID, setPluginName).then(res => {
            res.plugin_name = setPluginName;
          resp = res as unknown as Promise<any>
        }).catch(err => {
            return resp
        })
        return resp
    }

}
