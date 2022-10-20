import {GetServerTime} from "../../../../../wailsjs/go/backend/App";
import {Helpers} from "../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "get host time has uuid") as Error
}


export class ServerTime {
    connectionUUID!: string;

    private callTime(): Promise<any> {
        hasUUID(this.connectionUUID);
        return GetServerTime(this.connectionUUID)
    }

    public GetTime(): Promise<any> {
        return this.callTime();
    }

}
