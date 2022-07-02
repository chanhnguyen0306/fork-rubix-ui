import {model} from "../../../../../../wailsjs/go/models";
import {
    AddDevice,
    DeleteDevice,
    EditDevice,
    GetDevice, GetDevices,
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

    async GetAll(): Promise<Array<model.Device>> {
        let all: Promise<Array<model.Device>> = {} as Promise<Array<model.Device>>
        await GetDevices(this.connectionUUID, this.hostUUID).then(res => {
            all = res as unknown as Promise<Array<model.Device>>
        }).catch(err => {
            return undefined
        })
        return all
    }

    async GetOne(): Promise<model.Device> {
        hasUUID(this.uuid)
        let one: model.Device = {} as model.Device
        await GetDevice(this.connectionUUID, this.hostUUID, this.uuid).then(res => {
            one = res as model.Device
            this._this = one
        }).catch(err => {
            return undefined
        })
        return one
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
}