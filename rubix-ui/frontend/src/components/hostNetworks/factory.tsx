import {AddHostNetwork, EditHostNetwork, GetHostNetwork, GetHostNetworks} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";
import {assistmodel} from "../../../wailsjs/go/models";


function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "network or connection uuid") as Error
}

export class NetworksFactory {
    uuid!: string;
    private _this!: assistmodel.Network;
    private connectionUUID!: string;
    private count!: number

    get this(): assistmodel.Network {
        return this._this;
    }

    set this(value: assistmodel.Network) {
        this._this = value;
    }

    public GetTotalCount(): number {
        return this.count
    }


    // get the first connection uuid
    async GetFist(): Promise<assistmodel.Network> {
        let one: assistmodel.Network = {} as assistmodel.Network
        await this.GetAll().then(res => {
            one = res.at(0) as assistmodel.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async GetAll(): Promise<Array<assistmodel.Network>> {
        let all: Array<assistmodel.Network> = {} as Array<assistmodel.Network>
        await GetHostNetworks(this.connectionUUID).then(res => {
            all = res as Array<assistmodel.Network>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<assistmodel.Network> {
        hasUUID(this.uuid)
        let one: assistmodel.Network = {} as assistmodel.Network
        await GetHostNetwork(this.connectionUUID, this.uuid).then(res => {
            one = res as assistmodel.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Add(): Promise<assistmodel.Network> {
        hasUUID(this.uuid)
        let one: assistmodel.Network = {} as assistmodel.Network
        await AddHostNetwork(this.connectionUUID, this._this).then(res => {
            one = res as assistmodel.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<assistmodel.Network> {
        hasUUID(this.uuid)
        let one: assistmodel.Network = {} as assistmodel.Network
        await EditHostNetwork(this.connectionUUID, this.uuid, this._this).then(res => {
            one = res as assistmodel.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

}
