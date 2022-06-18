import {GetConnections, GetTime} from "../../../wailsjs/go/main/App";
import {model, storage} from "../../../wailsjs/go/models";



export class Connections {
    private _connectionUUID!: string;
    private _hostUUID!: string;
    private _all!: Array<storage.RubixConnection>

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


    async callAll(): Promise<Array<storage.RubixConnection>> {
        return await GetConnections()
    }

    // get the first connection uuid
    public GetFist() {
        // this.callTime().then(res => {
        //
        //
        //
        // }).catch(err => {
        //
        // })

    }


}