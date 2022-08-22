import {assistmodel, assitcli, main, store} from "../../../wailsjs/go/models";
import {
  AddHost,
  DeleteHost,
  DeleteHostBulk,
  EditHost,
  GetHost,
  GetHosts,
  GetHostSchema, GitListReleases,
  PingHost,
} from "../../../wailsjs/go/main/App";
import { Helpers } from "../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class HostsFactory {
  uuid!: string;
  private _this!: assistmodel.Host;
  connectionUUID!: string;



  async Schema(): Promise<assistmodel.HostSchema> {
    return await GetHostSchema(this.connectionUUID);
  }

  async PinHost(): Promise<boolean> {
    return await PingHost(this.connectionUUID, this.uuid);
  }

  async GetAll(): Promise<Array<assistmodel.Host>> {
    return await GetHosts(this.connectionUUID);
  }

  async GetOne(): Promise<assistmodel.Host> {
    return await GetHost(this.connectionUUID, this.uuid);
  }

  async Add(): Promise<assistmodel.Host> {
    return await AddHost(this.connectionUUID, this._this);
  }

  async Update(): Promise<assistmodel.Host> {
    return await EditHost(this.connectionUUID, this.uuid,this._this);
  }

  async Delete(): Promise<assitcli.Response> {
    return await DeleteHost(this.connectionUUID, this.uuid);
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    return await DeleteHostBulk(this.connectionUUID, uuids);
  }

}
