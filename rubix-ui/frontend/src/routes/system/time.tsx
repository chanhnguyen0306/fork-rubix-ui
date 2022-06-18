import {GetTime} from "../../../wailsjs/go/main/App";



export class HostTime {
    private _connectionUUID!: string;
    private _hostUUID!: string;

    get hostUUID(): string {
        return this._hostUUID;
    }

    set hostUUID(value: string) {
        this._hostUUID = value;
    }

    get connectionUUID(): string {
        return this._connectionUUID;
    }

    set connectionUUID(value: string) {
        this._connectionUUID = value;
    }


    private callTime(): Promise<any> {
        return GetTime(this._connectionUUID)
    }


    public DisplayTime() {
        this.callTime().then(res => {



        }).catch(err => {

        })

    }


}