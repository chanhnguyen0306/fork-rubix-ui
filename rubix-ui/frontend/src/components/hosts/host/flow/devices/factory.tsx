import {model} from "../../../../../../wailsjs/go/models";
import {
    AddDevice,
    DeleteDevice,
    EditDevice,
    GetDevice, GetDevices, GetFlowDeviceSchema, GetFlowPointSchema, GetNetworkDevices,
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
        await GetNetworkDevices(this.connectionUUID, this.hostUUID, networkUUID).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            return undefined
        })
        return all
    }


    async Add(): Promise<model.Device> {
        hasUUID(this.uuid)
        let one: model.Device = {} as model.Device
        await AddDevice(this.connectionUUID, this.hostUUID, this._this).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
    }

    async Update(): Promise<model.Device> {
        hasUUID(this.uuid)
        let one: model.Device = {} as model.Device
        await EditDevice(this.connectionUUID, this.hostUUID, this.uuid, this._this).then(res => {
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