import {GetHostActiveNetworks} from "../../../../wailsjs/go/main/App";
import {Helpers} from "../../../helpers/checks";

function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "get networking info host time has uuid") as Error
}


export class HostNetworking {
    connectionUUID!: string;
    hostUUID!: string;
    public GetActive(): Promise<any> {
        hasUUID(this.connectionUUID);
        hasUUID(this.hostUUID);
        return GetHostActiveNetworks(this.connectionUUID, this.hostUUID);
    }

}