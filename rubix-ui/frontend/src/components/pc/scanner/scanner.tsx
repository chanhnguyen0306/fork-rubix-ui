import {Helpers} from "../../../helpers/checks";
import {GetServerTime, Scanner} from "../../../../wailsjs/go/main/App";


function hasUUID(uuid: string): Error {
    return Helpers.IsUndefined(uuid, "get host time has uuid") as Error
}


export class PcScannerFactory {
    connectionUUID!: string;
    iface!: string;
    ip!: string;
    count!:number;
    ports!: [];

    private run(): Promise<any> {
        return Scanner(this.iface, this.ip, this.count, this.ports)
    }

    public Run(): Promise<any> {
        return this.run();
    }

}