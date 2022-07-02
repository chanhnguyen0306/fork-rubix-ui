import {model} from "../../../../../../wailsjs/go/models";
import {
    AddNetwork,
    DeleteNetwork,
    EditNetwork,
    GetNetwork,
    GetNetworks
} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
}


export class FlowNetworkFactory {
    hostUUID!: string;
    connectionUUID!: string;
    uuid!: string;
    _this!: model.Network;

    get this(): model.Network {
        return this._this;
    }

    set this(value: model.Network) {
        this._this = value;
    }

    async GetAll(): Promise<Array<model.Network>> {
        let all: Promise<Array<model.Network>> = {} as Promise<Array<model.Network>>
        await GetNetworks(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Network>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<model.Network> {
        hasUUID(this.uuid)
        let one: model.Network = {} as model.Network
        await GetNetwork(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }


    async Add(): Promise<model.Network> {
        hasUUID(this.uuid)
        let one: model.Network = {} as model.Network
        await AddNetwork(this.connectionUUID, this.hostUUID, this._this).then(res => {
            one = res as model.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<model.Network> {
        hasUUID(this.uuid)
        let one: model.Network = {} as model.Network
        await EditNetwork(this.connectionUUID, this.hostUUID, this.uuid, this._this).then(res => {
            one = res as model.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Delete(): Promise<model.Network> {
        hasUUID(this.uuid)
        let one: model.Network = {} as model.Network
        await DeleteNetwork(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Network
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }
}