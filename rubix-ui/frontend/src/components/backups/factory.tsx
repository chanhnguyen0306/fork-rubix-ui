import {storage} from "../../../wailsjs/go/models";
import {GetBackups} from "../../../wailsjs/go/main/App";


export class BackupFactory {

    async GetAll(): Promise<Array<storage.Backup>> {
        let all: Promise<Array<storage.Backup>> = {} as Promise<Array<storage.Backup>>
        await GetBackups().then(res => {
            all = res as unknown as Promise<Array<storage.Backup>>
        }).catch(err => {
            return undefined
        })
        return all
    }

}