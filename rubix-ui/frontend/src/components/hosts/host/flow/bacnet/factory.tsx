import {model} from "../../../../../../wailsjs/go/models";
import {BacnetWhois, GetBacnetDevicePoints} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class BacnetFactory {
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

    async Whois(bacnetNetworkUUID:string): Promise<Array<model.Device>> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let all: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>
        await BacnetWhois(this.connectionUUID, this.hostUUID, bacnetNetworkUUID).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            console.log("bacnet err", err)
            return undefined
        })
        return all
    }


    async DiscoverDevicePoints(deviceUUID:string, addPoints:boolean, makeWriteable:boolean): Promise<Array<model.Point>> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        makeWriteable = true
        let all: Promise<Array<model.Point>> = {} as Promise<Array<model.Point>>
        await GetBacnetDevicePoints(this.connectionUUID, this.hostUUID, deviceUUID, addPoints, makeWriteable).then(res => {
            all = res as unknown as Promise<Array<model.Point>>
        }).catch(err => {
            console.log("bacnet err", err)
            return undefined
        })
        return all
    }


}