import {model} from "../../../../../../wailsjs/go/models";
import {BacnetWhois} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class BacnetFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;
    bacnetNetworkUUID!: string;
    _this!: model.Point;

    get this(): model.Point {
        return this._this;
    }

    set this(value: model.Point) {
        this._this = value;
    }

    async Whois(): Promise<Array<model.Device>> {
        let all: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>
        await BacnetWhois(this.connectionUUID, this.hostUUID, this.bacnetNetworkUUID).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            console.log("bacnet err", err)
            return undefined
        })
        return all
    }


}