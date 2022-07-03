import {model} from "../../../../../../wailsjs/go/models";
import {
    AddPoint,
    DeletePoint,
    EditPoint,
    GetPoint, GetPoints,
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
        await GetPoints(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Point>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<model.Point> {
        hasUUID(this.uuid)
        let one: model.Point = {} as model.Point
        await GetPoint(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }


    async Add(): Promise<model.Point> {
        hasUUID(this.uuid)
        let one: model.Point = {} as model.Point
        await AddPoint(this.connectionUUID, this.hostUUID, this._this).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<model.Point> {
        hasUUID(this.uuid)
        let one: model.Point = {} as model.Point
        await EditPoint(this.connectionUUID, this.hostUUID, this.uuid, this._this).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Delete(): Promise<model.Point> {
        hasUUID(this.uuid)
        let one: model.Point = {} as model.Point
        await DeletePoint(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Point
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }
}