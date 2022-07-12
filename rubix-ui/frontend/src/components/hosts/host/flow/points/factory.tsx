import {main, model} from "../../../../../../wailsjs/go/models";
import {
    AddDevice,
    AddPoint, DeleteDeviceBulk,
    DeletePoint, DeletePointBulk,
    EditPoint, GetFlowNetworkSchema, GetFlowPointSchema,
    GetPoint, GetPoints, GetPointsForDevice,
} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowPointFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;
    _this!: model.Point;

    get this(): model.Point {
        return this._this;
    }

    set this(value: model.Point) {
        this._this = value;
    }

    async GetAll(): Promise<Array<model.Point>> {
        let all: Promise<Array<model.Point>> = {} as Promise<Array<model.Point>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetPoints(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Point>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetPointsForDevice(deviceUUID: string): Promise<Array<model.Point>> {
        let all: Promise<Array<model.Point>> = {} as Promise<Array<model.Point>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await GetPointsForDevice(this.connectionUUID, this.hostUUID, deviceUUID).then(res => {
            all = res as unknown as Promise<Array<model.Point>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<model.Point> {
        hasUUID(this.uuid)
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Point = {} as model.Point
        await GetPoint(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }


    async Add(deviceUUID:string, body:model.Point): Promise<model.Point> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Point = {} as model.Point
        body.device_uuid = deviceUUID
        await AddPoint(this.connectionUUID, this.hostUUID, body).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }


    async Update(uuid:string, body:model.Point): Promise<model.Point> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Point = {} as model.Point
        await EditPoint(this.connectionUUID, this.hostUUID, uuid, body).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Delete(): Promise<model.Point> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Point = {} as model.Point
        await DeletePoint(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }



    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        await DeletePointBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }

    async Schema(connUUID:string, hostUUID:string, setPluginName:string):Promise<any> {
        let all: Promise<any> = {} as Promise<any>
        hasUUID(connUUID)
        hasUUID(hostUUID)
        await GetFlowPointSchema(connUUID, hostUUID, setPluginName).then(res => {
            res.plugin_name = setPluginName;
            all = res as unknown as Promise<any>

        }).catch(err => {
            return undefined
        })
        return all
    }
}