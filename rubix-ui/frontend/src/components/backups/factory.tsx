import {main, storage} from "../../../wailsjs/go/models";
import {
    DeleteBackup, DeleteBackupBulk, DeleteLogBulk,
    GetBackup,
    GetBackups,
    GetBackupsByApplication,
    GetConnection, WiresBackup, WiresBackupRestore
} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "connection uuid") as Error;
}

export class BackupFactory {
    uuid!: string;
    application!: string;
    withData!: boolean
    connectionUUID!: string;
    hostUUID!: string;
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

    async GetBackupsRubixWires(): Promise<Array<storage.Backup>> {
        let all: Promise<Array<storage.Backup>> = {} as Promise<Array<storage.Backup>>
        await GetBackupsByApplication("RubixWires", false).then(res => {
            all = res as unknown as Promise<Array<storage.Backup>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async WiresBackup(userComment:string): Promise<storage.Backup>{
        let one: storage.Backup = {} as storage.Backup;
        await WiresBackup(this.connectionUUID, this.hostUUID, userComment)
            .then((res) => {
                one = res as storage.Backup;
                this._this = one;
            })
            .catch((err) => {
                return undefined;
            });
        return one;
    }

    async WiresRestore(): Promise<string> {
        let out = ""
        await WiresBackupRestore(this.connectionUUID, this.hostUUID, this.uuid)
            .then((res) => {
                out = res
            })
            .catch((err) => {
                return undefined;
            });
        return out;
    }

    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        await DeleteBackupBulk(uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }


}