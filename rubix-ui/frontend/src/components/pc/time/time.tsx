import {GetPcTime} from "../../../../wailsjs/go/main/App";



export class PcTime {
    private callTime(): Promise<any> {
        return GetPcTime();
    }
    public GetPCTime(): Promise<any> {
        return this.callTime();
    }
}