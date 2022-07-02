import {assistmodel} from "../../../wailsjs/go/models";
import {AddHost, EditHost, GetHost, GetHosts, PingHost} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";


function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class HostsFactory {
    uuid!: string;
    private _this!: assistmodel.Host;
    connectionUUID!: string;
    private count!: number

    get this(): assistmodel.Host {
        return this._this;
    }

    set this(value: assistmodel.Host) {
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
    async GetFist(): Promise<assistmodel.Host> {
        let one: assistmodel.Host = {} as assistmodel.Host
        await this.GetAll().then(res => {
            one = res.at(0) as assistmodel.Host
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


    async GetAll(): Promise<Array<assistmodel.Host>> {
        let all: Array<assistmodel.Host> = {} as Array<assistmodel.Host>
        await GetHosts(this.connectionUUID).then(res => {
            all = res as Array<assistmodel.Host>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<assistmodel.Host> {
        hasUUID(this.uuid)
        let one: assistmodel.Host = {} as assistmodel.Host
        await GetHost(this.connectionUUID, this.uuid).then(res => {
            console.log(6666, res)
            one = res as assistmodel.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Add(): Promise<assistmodel.Host> {
        hasUUID(this.uuid)
        let one: assistmodel.Host = {} as assistmodel.Host
        await AddHost(this.connectionUUID, this._this).then(res => {
            one = res as assistmodel.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<assistmodel.Host> {
        hasUUID(this.uuid)
        let one: assistmodel.Host = {} as assistmodel.Host
        await EditHost(this.connectionUUID, this.uuid, this._this).then(res => {
            one = res as assistmodel.Host
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

}
