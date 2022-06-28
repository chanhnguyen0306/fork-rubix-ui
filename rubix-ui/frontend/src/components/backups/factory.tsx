import {storage} from "../../../wailsjs/go/models";
import {
    DeleteBackup,
    GetBackup,
    GetBackups,
    GetBackupsByApplication,
    GetConnection
} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "connection uuid") as Error;
}

export class BackupFactory {
    uuid!: string;
    application!: string;
    withData!: boolean
    private _this!: storage.Backup;

    async GetAll(): Promise<Array<storage.Backup>> {
        let all: Promise<Array<storage.Backup>> = {} as Promise<Array<storage.Backup>>
        await GetBackups().then(res => {
            all = res as unknown as Promise<Array<storage.Backup>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetBackupsByApplication(): Promise<Array<storage.Backup>> {
        hasUUID(this.uuid);
        let withData = false
        if (this.withData != undefined) {
            withData = this.withData
        }
        let all: Promise<Array<storage.Backup>> = {} as Promise<Array<storage.Backup>>
        await GetBackupsByApplication(this.application, withData).then(res => {
            all = res as unknown as Promise<Array<storage.Backup>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<storage.Backup> {
        hasUUID(this.uuid);
        let one: storage.Backup = {} as storage.Backup;
        await GetBackup(this.uuid)
            .then((res) => {
                one = res as storage.Backup;
                this._this = one;
            })
            .catch((err) => {
                return undefined;
            });
        return one;
    }

    async Delete(): Promise<string> {
        let out = ""
        await DeleteBackup(this.uuid)
            .then((res) => {
                out = res
            })
            .catch((err) => {
                return undefined;
            });
        return out;
    }





}