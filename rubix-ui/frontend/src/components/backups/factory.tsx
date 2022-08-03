import { main, storage } from "../../../wailsjs/go/models";
import {
  DeleteBackupBulk,
  GetBackup,
  GetBackups,
  GetBackupsByApplication,
  ImportBackup,
  WiresBackup,
  WiresBackupRestore,
} from "../../../wailsjs/go/main/App";
import { Helpers } from "../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "connection uuid") as Error;
}

export class BackupFactory {

  connectionUUID!: string;
  hostUUID!: string;
  private _this!: storage.Backup;

  async GetAll(): Promise<Array<storage.Backup>> {
    let all: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackups()
      .then((res) => {
        all = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return all;
      });
    return all;
  }

  async GetBackupsByApplication(application:string, withData:boolean): Promise<Array<storage.Backup>> {

    let all: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackupsByApplication(application, withData)
      .then((res) => {
        all = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return all;
      });
    return all;
  }

  async Import(body: storage.Backup): Promise<string> {
    let one = "";
    await ImportBackup(body)
      .then((res) => {
        one = res as string;
      })
      .catch((err) => {
        return one;
      });
    return one;
  }

  async GetOne(uuid:string): Promise<storage.Backup> {
    hasUUID(uuid);
    let one: storage.Backup = {} as storage.Backup;
    await GetBackup(uuid)
      .then((res) => {
        one = res as storage.Backup;
        this._this = one;
      })
      .catch((err) => {
        return one;
      });
    return one;
  }

  async GetBackupsRubixWires(): Promise<Array<storage.Backup>> {
    let all: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackupsByApplication("RubixWires", false)
      .then((res) => {
        all = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return all;
      });
    return all;
  }

  async WiresBackup(userComment: string): Promise<storage.Backup> {
    let one: storage.Backup = {} as storage.Backup;
    await WiresBackup(this.connectionUUID, this.hostUUID, userComment)
      .then((res) => {
        one = res as storage.Backup;
        this._this = one;
      })
      .catch((err) => {
        return one;
      });
    return one;
  }

  async WiresRestore(uuid:string): Promise<string> {
    let out = "";
    await WiresBackupRestore(this.connectionUUID, this.hostUUID, uuid)
      .then((res) => {
        out = res;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    let out: Promise<any> = {} as Promise<any>;
    await DeleteBackupBulk(uuids)
      .then((res) => {
        out = res as Promise<any>;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }
}
