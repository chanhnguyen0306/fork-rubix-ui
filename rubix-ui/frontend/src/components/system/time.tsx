import {GetTime} from "../../../wailsjs/go/main/App";
import {Helpers} from "../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "get host time has uuid") as Error
}


export class HostTime {
    connectionUUID!: string;
    hostUUID!: string;

    private callTime(): Promise<any> {
        hasUUID(this.connectionUUID);
        hasUUID(this.hostUUID);
        return GetTime(this.connectionUUID, this.hostUUID);
    }

    public GetHostTime(): Promise<any> {
        return this.callTime();
    }

}