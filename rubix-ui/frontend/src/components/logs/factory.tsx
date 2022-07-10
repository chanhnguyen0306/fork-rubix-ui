import {main, model} from "../../../wailsjs/go/models";
import {DeleteDeviceBulk, DeleteLogBulk, GetLogs, GetLogsByConnection} from "../../../wailsjs/go/main/App";


export class LogFactory {
    connectionUUID!: string;

    async GetAll(): Promise<any> {
        let all: Promise<any> = {} as Promise<any>
        await GetLogs().then(res => {
            all = res as Promise<any>
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

    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        await DeleteLogBulk(uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }

}