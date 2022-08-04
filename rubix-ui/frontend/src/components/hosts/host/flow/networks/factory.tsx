import { main, model } from "../../../../../../wailsjs/go/models";
import {
  AddNetwork,
  DeleteNetwork,
  DeleteNetworkBulk,
  EditNetwork,
  GetFlowNetworkSchema,
  GetNetwork,
  GetNetworks,
  ImportBackup,
  ImportNetwork,
} from "../../../../../../wailsjs/go/main/App";
import { Helpers } from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class FlowNetworkFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(withDevice: boolean): Promise<Array<model.Network>> {
    let resp: Promise<Array<model.Network>> = {} as Promise<
      Array<model.Network>
    >;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await GetNetworks(this.connectionUUID, this.hostUUID, withDevice)
      .then((res) => {
        resp = res as unknown as Promise<Array<model.Network>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetOne(uuid: string, withDevice: boolean): Promise<model.Network> {
    let resp: model.Network = {} as model.Network;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await GetNetwork(this.connectionUUID, this.hostUUID, uuid, withDevice)
      .then((res) => {
        resp = res as model.Network;
      })
      .catch((resp) => {
        return resp;
      });
    return resp;
  }

  async Add(body: model.Network): Promise<model.Network> {
    let resp: model.Network = {} as model.Network;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await AddNetwork(this.connectionUUID, this.hostUUID, body)
      .then((res) => {
        resp = res as model.Network;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Update(uuid: string, body: model.Network): Promise<model.Network> {
    let resp: model.Network = {} as model.Network;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await EditNetwork(this.connectionUUID, this.hostUUID, uuid, body)
      .then((res) => {
        resp = res as model.Network;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Delete(uuid: string): Promise<model.Network> {
    let resp: model.Network = {} as model.Network;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await DeleteNetwork(this.connectionUUID, this.hostUUID, uuid)
      .then((res) => {
        resp = res as model.Network;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    let resp: Promise<any> = {} as Promise<any>;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await DeleteNetworkBulk(this.connectionUUID, this.hostUUID, uuids)
      .then((res) => {
        resp = res as Promise<any>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  // Import  a newImport will create a new network (or if false it will edit the network), and if createAllChild is true it will add all the devices and points
  async Import(
    newImport: boolean,
    createAllChild: boolean,
    body: model.Network
  ): Promise<model.Network> {
    let resp: model.Network = {} as model.Network;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await ImportNetwork(
      this.connectionUUID,
      this.hostUUID,
      newImport,
      createAllChild,
      body
    )
      .then((res) => {
        resp = res as model.Network;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Schema(
    connUUID: string,
    hostUUID: string,
    setPluginName: string
  ): Promise<any> {
    let resp: Promise<any> = {} as Promise<any>;
    hasUUID(connUUID);
    hasUUID(hostUUID);
    await GetFlowNetworkSchema(connUUID, hostUUID, setPluginName)
      .then((res) => {
        res.plugin_name = setPluginName;
        resp = res as unknown as Promise<any>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }
}
