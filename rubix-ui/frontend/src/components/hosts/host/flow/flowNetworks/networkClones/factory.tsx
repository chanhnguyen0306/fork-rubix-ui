import {main, model} from "../../../../../../../wailsjs/go/models";
import {
    DeleteFlowNetworkClone,
    DeleteFlowNetworkCloneBulk,
    GetFlowNetworkClone,
    GetFlowNetworkClones,
} from "../../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowFrameworkNetworkCloneFactory {
    hostUUID!: string;
    connectionUUID!: string;

    async GetAll(withStream: boolean): Promise<Array<model.FlowNetworkClone>> {
        let all: Promise<Array<model.FlowNetworkClone>> = {} as Promise<Array<model.FlowNetworkClone>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetFlowNetworkClones(this.connectionUUID, this.hostUUID, withStream).then(res => {
            all = res as unknown as Promise<Array<model.FlowNetworkClone>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(uuid: string, withStream: boolean): Promise<model.FlowNetworkClone> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.FlowNetworkClone = {} as model.FlowNetworkClone
        await GetFlowNetworkClone(this.connectionUUID, this.hostUUID, uuid, withStream).then(res => {
            resp = res as model.FlowNetworkClone
        }).catch(err => {
            return undefined
        })
        return resp
    }

    async Delete(uuid: string): Promise<model.FlowNetworkClone> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.FlowNetworkClone = {} as model.FlowNetworkClone
        await DeleteFlowNetworkClone(this.connectionUUID, this.hostUUID, uuid).then(res => {
            resp = res as model.FlowNetworkClone
        }).catch(err => {
            return undefined
        })
        return resp
    }

    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let out: Promise<any> = {} as Promise<any>
        await DeleteFlowNetworkCloneBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }


}