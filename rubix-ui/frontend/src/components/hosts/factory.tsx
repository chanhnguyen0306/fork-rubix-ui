import { assistmodel, assitcli, main } from "../../../wailsjs/go/models";
import {
  AddHost,
  DeleteHost,
  DeleteHostBulk,
  EditHost,
  GetHost,
  GetHosts,
  GetHostSchema,
  PingHost,
} from "../../../wailsjs/go/main/App";
import { Helpers } from "../../helpers/checks";

import Host = assistmodel.Host;
import HostSchema = assistmodel.HostSchema;
import Response = assitcli.Response;
import UUIDs = main.UUIDs;

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class HostsFactory {
  uuid!: string;
  private _this!: Host;
  connectionUUID!: string;

  async Schema(): Promise<HostSchema> {
    return await GetHostSchema(this.connectionUUID);
  }

  async PingHost(): Promise<boolean> {
    return await PingHost(this.connectionUUID, this.uuid);
  }

  async GetAll(): Promise<Array<Host>> {
    return await GetHosts(this.connectionUUID);
  }

  async GetOne(): Promise<Host> {
    return await GetHost(this.connectionUUID, this.uuid);
  }

  async Add(): Promise<Host> {
    return await AddHost(this.connectionUUID, this._this);
  }

  async Update(): Promise<Host> {
    return await EditHost(this.connectionUUID, this.uuid, this._this);
  }

  async Delete(): Promise<Response> {
    return await DeleteHost(this.connectionUUID, this.uuid);
  }

  async BulkDelete(uuids: Array<UUIDs>): Promise<any> {
    return await DeleteHostBulk(this.connectionUUID, uuids);
  }

  async Ping(hostUUID: string): Promise<boolean> {
    return true;
  }
}
