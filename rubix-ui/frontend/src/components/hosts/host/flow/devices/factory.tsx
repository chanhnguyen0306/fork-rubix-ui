import {main, model} from "../../../../../../wailsjs/go/models";
import {
    AddDevice,
    DeleteDevice, DeleteDeviceBulk,
    EditDevice,
    GetDevice, GetDevices, GetFlowDeviceSchema, GetNetworkDevices,
} from "../../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "host or connection uuid") as Error
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

    async GetAll(withPoints:boolean): Promise<Array<model.Device>> {
        let all: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>
        await GetDevices(this.connectionUUID, this.hostUUID, withPoints).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(withPoints:boolean): Promise<model.Device> {
        hasUUID(this.uuid)
        let one: model.Device = {} as model.Device
        await GetDevice(this.connectionUUID, this.hostUUID, this.uuid, withPoints).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async GetNetworkDevices(networkUUID:string): Promise<Array<model.Device>> {
        let all: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        hasUUID(networkUUID)
        await GetNetworkDevices(this.connectionUUID, this.hostUUID, networkUUID).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            return undefined
        })
        return all
    }


    async Add(networkUUID: string | undefined, body: model.Device): Promise<model.Device> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Device = {} as model.Device
        body.network_uuid = networkUUID
        await AddDevice(this.connectionUUID, this.hostUUID, body).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(deviceUUID:string, body:model.Device): Promise<model.Device> {
        hasUUID(this.connectionUUID)
        hasUUID(this.hostUUID)
        let one: model.Device = {} as model.Device
        await EditDevice(this.connectionUUID, this.hostUUID, deviceUUID, body).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Delete(): Promise<model.Device> {
        hasUUID(this.uuid)
        let one: model.Device = {} as model.Device
        await DeleteDevice(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }


    async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
        let out: Promise<any> = {} as Promise<any>
        await DeleteDeviceBulk(this.connectionUUID, this.hostUUID, uuids).then(res => {
            out = res as Promise<any>
        }).catch(err => {
            return undefined
        })
        return out
    }



    async Schema(connUUID:string, hostUUID:string, setPluginName:string):Promise<any> {
        let all: Promise<any> = {} as Promise<any>
        hasUUID(connUUID)
        hasUUID(hostUUID)
        await GetFlowDeviceSchema(connUUID, hostUUID, setPluginName).then(res => {
            res.plugin_name = setPluginName;
            all = res as unknown as Promise<any>

        }).catch(err => {
            return undefined
        })
        return all
    }
}