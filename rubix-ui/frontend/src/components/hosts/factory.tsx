import {model} from "../../../wailsjs/go/models";
import {AddHost, EditHost, GetHost, GetHosts, PingHost} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";


function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class HostsFactory {
    uuid!: string;
    private _this!: model.Host;
    private connectionUUID!: string;
    private count!: number

    get this(): model.Host {
        return this._this;
    }

    set this(value: model.Host) {
        this._this = value;
    }

    public GetTotalCount(): number {
        return this.count
    }

    // will try and ping the remote server
    // example ping 192,1568.15.10:1662
    async PinHost(): Promise<boolean> {
        let out = false
        await PingHost(this.connectionUUID, this.uuid).then(res => {
            out = res as boolean
        }).catch(err => {
            return undefined
        })
        return out
    }

    // get the first connection uuid
    async GetFist(): Promise<model.Host> {
        let one: model.Host = {} as model.Host
        await this.GetAll().then(res => {
            one = res.at(0) as model.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    // get the first network uuid
    async GetFistUUID(): Promise<string> {
        let uuid = ""
        this.GetFist().then(res => {
            uuid = res.uuid
        })
        return uuid
    }


    async GetAll(): Promise<Array<model.Host>> {
        let all: Array<model.Host> = {} as Array<model.Host>
        await GetHosts(this.connectionUUID).then(res => {
            all = res as Array<model.Host>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<model.Host> {
        hasUUID(this.uuid)
        let one: model.Host = {} as model.Host
        await GetHost(this.connectionUUID, this.uuid).then(res => {
            one = res as model.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Add(): Promise<model.Host> {
        hasUUID(this.uuid)
        let one: model.Host = {} as model.Host
        await AddHost(this.connectionUUID, this._this).then(res => {
            one = res as model.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<model.Host> {
        hasUUID(this.uuid)
        let one: model.Host = {} as model.Host
        await EditHost(this.connectionUUID, this.uuid, this._this).then(res => {
            one = res as model.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

}
