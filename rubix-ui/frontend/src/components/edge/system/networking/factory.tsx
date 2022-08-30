import {
  EdgeDHCPPortExists,
  EdgeDHCPSetAsAuto,
  EdgeDHCPSetStaticIP,
  EdgeGetNetworks,
  GetRcNetworkSchema,
} from "../../../../../wailsjs/go/main/App";
import { Helpers } from "../../../../helpers/checks";
import { dhcpd, store, system } from "../../../../../wailsjs/go/models";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(
    uuid,
    "get networking info host time has uuid"
  ) as Error;
}

export class HostNetworkingFactory {
  connectionUUID!: string;
  hostUUID!: string;

  public GetNetworks(): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return EdgeGetNetworks(this.connectionUUID, this.hostUUID);
  }

  public GetRcNetworkSchema(): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return GetRcNetworkSchema(this.connectionUUID, this.hostUUID);
  }

  public RubixScan(): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return EdgeGetNetworks(this.connectionUUID, this.hostUUID);
  }

  async EdgeDHCPPortExists(
    body: system.NetworkingBody
  ): Promise<system.DHCPPortExists> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeDHCPPortExists(this.connectionUUID, this.hostUUID, body);
  }

  async EdgeDHCPSetAsAuto(
    body: system.NetworkingBody
  ): Promise<system.Message> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeDHCPSetAsAuto(this.connectionUUID, this.hostUUID, body);
  }

  async EdgeDHCPSetStaticIP(body: dhcpd.SetStaticIP): Promise<string> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeDHCPSetStaticIP(this.connectionUUID, this.hostUUID, body);
  }
}
