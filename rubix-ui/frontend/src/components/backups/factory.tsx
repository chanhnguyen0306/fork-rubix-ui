import {main, storage, store} from "../../../wailsjs/go/models";
import {
  DeleteBackupBulk, DoBackup, ExportBackup,
  GetBackup,
  GetBackups,
  GetBackupsByApplication, GetNetworkBackupsByPlugin, GetRelease,
  ImportBackup,
  WiresBackup,
  WiresBackupRestore,
} from "../../../wailsjs/go/main/App";
import { Helpers } from "../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "connection uuid") as Error;
}

export class BackupFactory {

  AppRubixWires = "RubixWires"
  SubWiresFlow = "WiresFlow"
  AppFlowFramework = "FlowFramework"
  SubFlowFrameworkNetwork = "FlowFrameworkNetwork"
  SubFlowFrameworkDevice = "FlowFrameworkDevice"
  SubFlowFrameworkPoint = "FlowFrameworkPoint"

  connectionUUID!: string;
  hostUUID!: string;


  async GetAll(): Promise<Array<storage.Backup>> {
    let resp: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackups()
      .then((res) => {
        resp = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetBackupsByApplication(application:string, subApplication:string, withData:boolean): Promise<Array<storage.Backup>> {
    let resp: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackupsByApplication(application, subApplication, withData)
      .then((res) => {
        resp = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Import(body: storage.Backup): Promise<string> {
    let resp = "";
    await ImportBackup(body)
      .then((res) => {
        resp = res as string;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetOne(uuid:string): Promise<storage.Backup> {
    hasUUID(uuid);
    let resp: storage.Backup = {} as storage.Backup;
    await GetBackup(uuid)
      .then((res) => {
        resp = res as storage.Backup;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetNetworkBackupsByPlugin(pluginName:string): Promise<Array<storage.Backup>> {
    let resp: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
      >;
    await GetNetworkBackupsByPlugin(this.AppFlowFramework, this.SubFlowFrameworkNetwork, pluginName)
      .then((res) => {
        resp = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetBackupsRubixWires(): Promise<Array<storage.Backup>> {
    let resp: Promise<Array<storage.Backup>> = {} as Promise<
      Array<storage.Backup>
    >;
    await GetBackupsByApplication(this.AppRubixWires, "", false)
      .then((res) => {
        resp = res as unknown as Promise<Array<storage.Backup>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }


  // DoBackup do an export/backup eg: Flow Networks application=FlowFramework, subApplication=FrameworkNetwork
  async DoBackup(application: string, subApplication: string, userComment: string, backUpData: any): Promise<storage.Backup> {
    hasUUID(this.connectionUUID)
    hasUUID(this.hostUUID)
    let resp: storage.Backup = {} as storage.Backup;
    await DoBackup(this.connectionUUID, this.hostUUID, application, subApplication, userComment, backUpData)
      .then((res) => {
        resp = res as storage.Backup;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async WiresBackup(userComment: string): Promise<storage.Backup> {
    hasUUID(this.connectionUUID)
    hasUUID(this.hostUUID)
    let resp: storage.Backup = {} as storage.Backup;
    await WiresBackup(this.connectionUUID, this.hostUUID, userComment)
      .then((res) => {
        resp = res as storage.Backup;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async WiresRestore(uuid:string): Promise<string> {
    hasUUID(this.connectionUUID)
    hasUUID(this.hostUUID)
    let resp = "";
    await WiresBackupRestore(this.connectionUUID, this.hostUUID, uuid)
      .then((res) => {
        resp = res;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    let resp: Promise<any> = {} as Promise<any>;
    await DeleteBackupBulk(uuids)
      .then((res) => {
        resp = res as Promise<any>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Export(uuid: string){
    return ExportBackup(uuid);
  }

}
