import { main, model, storage } from "../../../../../../wailsjs/go/models";
import {
  AddDevice, AddDevicesBulk, AddPointsBulk,
  DeleteDevice,
  DeleteDeviceBulk,
  EditDevice,
  ExportDevicesBulk,
  GetDevice,
  GetDevices,
  GetFlowDeviceSchema,
  GetNetworkDevices,
  ImportDevicesBulk,
} from "../../../../../../wailsjs/go/main/App";
import { Helpers } from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class FlowDeviceFactory {
  hostUUID!: string;
  connectionUUID!: string;
  uuid!: string;
  _this!: model.Device;

  get this(): model.Device {
    return this._this;
  }

  set this(value: model.Device) {
    this._this = value;
  }

  async GetAll(withPoints: boolean): Promise<Array<model.Device>> {
    let resp: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>;
    await GetDevices(this.connectionUUID, this.hostUUID, withPoints)
      .then((res) => {
        resp = res as unknown as Promise<Array<model.Device>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetOne(withPoints: boolean): Promise<model.Device> {
    hasUUID(this.uuid);
    let resp: model.Device = {} as model.Device;
    await GetDevice(this.connectionUUID, this.hostUUID, this.uuid, withPoints)
      .then((res) => {
        resp = res as model.Device;
        this._this = resp;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async GetNetworkDevices(networkUUID: string): Promise<Array<model.Device>> {
    let resp: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    hasUUID(networkUUID);
    await GetNetworkDevices(this.connectionUUID, this.hostUUID, networkUUID)
      .then((res) => {
        resp = res as unknown as Promise<Array<model.Device>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Add(
    networkUUID: string | undefined,
    body: model.Device
  ): Promise<model.Device> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    let resp: model.Device = {} as model.Device;
    body.network_uuid = networkUUID;
    await AddDevice(this.connectionUUID, this.hostUUID, body)
      .then((res) => {
        resp = res as model.Device;
        this._this = resp;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async AddBulk(devices: Array<model.Device>) {
    return AddDevicesBulk(this.connectionUUID, this.hostUUID, devices);
  }


  async Update(deviceUUID: string, body: model.Device): Promise<model.Device> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    let resp: model.Device = {} as model.Device;
    await EditDevice(this.connectionUUID, this.hostUUID, deviceUUID, body)
      .then((res) => {
        resp = res as model.Device;
        this._this = resp;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async Delete(): Promise<model.Device> {
    hasUUID(this.uuid);
    let resp: model.Device = {} as model.Device;
    await DeleteDevice(this.connectionUUID, this.hostUUID, this.uuid)
      .then((res) => {
        resp = res as model.Device;
        this._this = resp;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    let resp: Promise<any> = {} as Promise<any>;
    await DeleteDeviceBulk(this.connectionUUID, this.hostUUID, uuids)
      .then((res) => {
        resp = res as Promise<any>;
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
    await GetFlowDeviceSchema(connUUID, hostUUID, setPluginName)
      .then((res) => {
        res.plugin_name = setPluginName;
        resp = res as unknown as Promise<any>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async BulkImport(
    backupUUID: string,
    networkUUID: string
  ): Promise<main.BulkAddResponse> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await ImportDevicesBulk(
      this.connectionUUID,
      this.hostUUID,
      backupUUID,
      networkUUID
    );
  }

  async BulkExport(
    userComment: string,
    networkUUID: string,
    uuids: Array<string>
  ): Promise<storage.Backup> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await ExportDevicesBulk(
      this.connectionUUID,
      this.hostUUID,
      userComment,
      networkUUID,
      uuids
    );
  }
}
