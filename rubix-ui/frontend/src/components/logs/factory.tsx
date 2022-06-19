import {model} from "../../../wailsjs/go/models";
import {GetLogs, GetLogsByConnection} from "../../../wailsjs/go/main/App";


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

}