import {
  EdgeBiosInstalledRubixEdgeVersion,
  EdgeBiosRubixEdgeInstall,
  EdgeBiosRubixEdgeVersions
} from "../../../../../wailsjs/go/backend/App";

export class InstallFactory {
  connectionUUID!: string;

  public InstallRubixEdge(hostUUID: string, version: string): Promise<any> {
    return EdgeBiosRubixEdgeInstall(this.connectionUUID, hostUUID, version);
  }

  public GetRubixEdgeVersions(): Promise<any> {
    return EdgeBiosRubixEdgeVersions();
  }

  public GetInstalledRubixEdgeVersion(hostUUID: string): Promise<any> {
    return EdgeBiosInstalledRubixEdgeVersion(this.connectionUUID, hostUUID);
  }
}
