import {backend, model} from "../../../../../../../wailsjs/go/models";
import {
    AddProducer,
    DeleteProducer,
    DeleteProducerBulk,
    EditProducer,
    GetProducer,
    GetProducers,
} from "../../../../../../../wailsjs/go/backend/App";
import {Helpers} from "../../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowProducerFactory {
    hostUUID!: string;
    connectionUUID!: string;

    async GetAll(): Promise<Array<model.Producer>> {
        let resp: Promise<Array<model.Producer>> = {} as Promise<Array<model.Producer>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetProducers(this.connectionUUID, this.hostUUID).then(res => {
            resp = res as unknown as Promise<Array<model.Producer>>
        }).catch(err => {
            return resp
        })
        return resp
    }

    async GetOne(uuid:string): Promise<model.Producer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Producer = {} as model.Producer
        await GetProducer(this.connectionUUID, this.hostUUID, uuid).then(res => {
            resp = res as model.Producer
        }).catch(err => {
            return resp
        })
        return resp
    }


    async Add(body: model.Producer): Promise<model.Producer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Producer = {} as model.Producer
        await AddProducer(this.connectionUUID, this.hostUUID, body).then(res => {
            resp = res as model.Producer
        }).catch(err => {
            return resp
        })
        return resp
    }

    async Update(uuid:string, body: model.Producer): Promise<model.Producer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: model.Producer = {} as model.Producer
        await EditProducer(this.connectionUUID, this.hostUUID, uuid, body).then(res => {
            resp = res as model.Producer
        }).catch(err => {
            return resp
        })
        return resp
    }

    async Delete(uuid:string): Promise<model.Producer> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
           let resp: model.Producer = {} as model.Producer
        await DeleteProducer(this.connectionUUID, this.hostUUID, uuid).then(res => {
            resp = res as model.Producer
        }).catch(err => {
            return resp
        })
        return resp
    }

    async BulkDelete(uuids: Array<backend.UUIDs>): Promise<any> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let resp: Promise<any> = {} as Promise<any>
        await DeleteProducerBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            resp = res as Promise<any>
        }).catch(err => {
            return resp
        })
        return resp
    }


}
