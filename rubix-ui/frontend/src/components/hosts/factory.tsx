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

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class HostsFactory {
  uuid!: string;
  private _this!: assistmodel.Host;
  connectionUUID!: string;
  private count!: number;

  get this(): assistmodel.Host {
    return this._this;
  }

  set this(value: assistmodel.Host) {
    this._this = value;
  }

  public GetTotalCount(): number {
    return this.count;
  }

  async Schema(): Promise<any> {
    let all: Promise<any> = {} as Promise<any>;
    await GetHostSchema(this.connectionUUID)
      .then((res) => {
        all = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  // will try and ping the remote server
  // example ping 192,1568.15.10:1662
  async PinHost(): Promise<boolean> {
    let out = false;
    await PingHost(this.connectionUUID, this.uuid)
      .then((res) => {
        out = res as boolean;
      })
      .catch((err) => {
        return undefined;
      });
    return out;
  }

  // get the first connection uuid
  async GetFist(): Promise<assistmodel.Host> {
    let one: assistmodel.Host = {} as assistmodel.Host;
    await this.GetAll()
      .then((res) => {
        one = res.at(0) as assistmodel.Host;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  // get the first network uuid
  async GetFistUUID(): Promise<string> {
    let uuid = "";
    this.GetFist().then((res) => {
      uuid = res.uuid;
    });
    return uuid;
  }

  async GetAll(): Promise<Array<assistmodel.Host>> {
    let all: Array<assistmodel.Host> = {} as Array<assistmodel.Host>;
    await GetHosts(this.connectionUUID)
      .then((res) => {
        all = res as Array<assistmodel.Host>;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  async GetOne(): Promise<assistmodel.Host> {
    hasUUID(this.uuid);
    let one: assistmodel.Host = {} as assistmodel.Host;
    await GetHost(this.connectionUUID, this.uuid)
      .then((res) => {
        one = res as assistmodel.Host;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Add(): Promise<assistmodel.Host> {
    hasUUID(this.uuid);
    let one: assistmodel.Host = {} as assistmodel.Host;
    await AddHost(this.connectionUUID, this._this)
      .then((res) => {
        one = res as assistmodel.Host;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Update(): Promise<assistmodel.Host> {
    hasUUID(this.uuid);
    let one: assistmodel.Host = {} as assistmodel.Host;
    await EditHost(this.connectionUUID, this.uuid, this._this)
      .then((res) => {
        one = res as assistmodel.Host;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Delete(): Promise<assitcli.Response> {
    hasUUID(this.uuid);
    let one: assitcli.Response = {} as assitcli.Response;
    await DeleteHost(this.connectionUUID, this.uuid)
      .then((res) => {
        one = res as assitcli.Response;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    hasUUID(this.connectionUUID);
    let out: Promise<any> = {} as Promise<any>;
    await DeleteHostBulk(this.connectionUUID, uuids)
      .then((res) => {
        out = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return out;
  }
}
