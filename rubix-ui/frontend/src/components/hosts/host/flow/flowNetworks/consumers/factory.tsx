import {main, model} from "../../../../../../../wailsjs/go/models";
import {
    AddConsumer,
    DeleteConsumer,
    DeleteConsumerBulk,
    EditConsumer,
    GetConsumer,
    GetConsumers,
} from "../../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowConsumerFactory {
    hostUUID!: string;
    connectionUUID!: string;
    
    async GetAll(withStream: boolean): Promise<Array<model.Consumer>> {
        let all: Promise<Array<model.Consumer>> = {} as Promise<Array<model.Consumer>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetConsumers(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Consumer>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(uuid:string): Promise<model.Consumer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Consumer = {} as model.Consumer
        await GetConsumer(this.connectionUUID, this.hostUUID, uuid).then(res => {
            resp = res as model.Consumer
        }).catch(err => {
            return undefined
        })
        return resp
    }


    async Add(body: model.Consumer): Promise<model.Consumer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Consumer = {} as model.Consumer
        await AddConsumer(this.connectionUUID, this.hostUUID, body).then(res => {
            resp = res as model.Consumer
        }).catch(err => {
            return undefined
        })
        return resp
    }

    async Update(uuid:string, body: model.Consumer): Promise<model.Consumer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Consumer = {} as model.Consumer
        await EditConsumer(this.connectionUUID, this.hostUUID, uuid, body).then(res => {
            resp = res as model.Consumer
        }).catch(err => {
            return undefined
        })
        return resp
    }

    async Delete(uuid:string): Promise<model.Consumer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
           let resp: model.Consumer = {} as model.Consumer
        await DeleteConsumer(this.connectionUUID, this.hostUUID, uuid).then(res => {
            resp = res as model.Consumer
        }).catch(err => {
            return undefined
        })
        return resp
    }

    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let out: Promise<any> = {} as Promise<any>
        await DeleteConsumerBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }


}