import {GetServerNetworking} from "../../../../../wailsjs/go/main/App";
import {Helpers} from "../../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "get networking info host time has uuid") as Error
}


export class ServerNetworking {
    connectionUUID!: string;
    public GetActive(): Promise<any> {
        hasUUID(this.connectionUUID);
        return GetServerNetworking(this.connectionUUID);
    }
}