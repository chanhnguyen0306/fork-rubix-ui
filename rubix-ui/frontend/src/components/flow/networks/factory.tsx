import {model} from "../../../../wailsjs/go/models";
import {GetLogsByConnection, GetNetworks} from "../../../../wailsjs/go/main/App";


export class FlowNetworkFactory {
    hostUUID!: string;
    connectionUUID!: string;
    async GetAll(): Promise<Array<model.Network>>{
        let all: Promise<Array<model.Network>> = {} as Promise<Array<model.Network>>
        await GetNetworks(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Network>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetAllByConnection(): Promise<any> {
        let all: Promise<any> = {} as Promise<any>
        await GetLogsByConnection(this.connectionUUID).then(res => {
            all = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return all
    }

}