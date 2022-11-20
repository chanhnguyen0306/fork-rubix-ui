import {
  AddHostNetwork,
  DeleteHostNetworkBulk,
  EditHostNetwork,
  GetHostNetwork,
  GetHostNetworks,
  GetNetworkSchema,
} from "../../../wailsjs/go/backend/App";
import { Helpers } from "../../helpers/checks";
import { backend, model } from "../../../wailsjs/go/models";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "network or connection uuid") as Error;
}

export class NetworksFactory {
  uuid!: string;
  connectionUUID!: string;
  _this!: model.Network;
  private count!: number;

  get this(): model.Network {
    return this._this;
  }

  set this(value: model.Network) {
    this._this = value;
  }

  public GetTotalCount(): number {
    return this.count;
  }

  // get the first connection uuid
  async GetFist(): Promise<model.Network> {
    let one: model.Network = {} as model.Network;
    await this.GetAll()
      .then((res) => {
        one = res.at(0) as model.Network;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async GetAll(): Promise<Array<model.Network>> {
    let all: Array<model.Network> = {} as Array<model.Network>;
    await GetHostNetworks(this.connectionUUID)
      .then((res) => {
        all = res as Array<model.Network>;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  async GetOne(): Promise<model.Network> {
    hasUUID(this.uuid);
    let one: model.Network = {} as model.Network;
    await GetHostNetwork(this.connectionUUID, this.uuid)
      .then((res) => {
        one = res as model.Network;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Add(): Promise<model.Network> {
    hasUUID(this.connectionUUID);
    let one: model.Network = {} as model.Network;
    await AddHostNetwork(this.connectionUUID, this._this)
      .then((res) => {
        one = res as model.Network;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Update(): Promise<model.Network> {
    hasUUID(this.uuid);
    let one: model.Network = {} as model.Network;
    await EditHostNetwork(this.connectionUUID, this.uuid, this._this)
      .then((res) => {
        one = res as model.Network;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async BulkDelete(uuids: Array<backend.UUIDs>): Promise<any> {
    hasUUID(this.connectionUUID);
    let out: Promise<any> = {} as Promise<any>;
    await DeleteHostNetworkBulk(this.connectionUUID, uuids)
      .then((res) => {
        out = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return out;
  }

  async Schema(): Promise<any> {
    hasUUID(this.connectionUUID);
    let out = {} as any;
    await GetNetworkSchema(this.connectionUUID)
      .then((res) => {
        out = res;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }
}
