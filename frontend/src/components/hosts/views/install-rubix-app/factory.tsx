import {
  EdgeInstallApp,
  EdgeRubixAppVersions
} from "../../../../../wailsjs/go/backend/App";

export class InstallAppFactory {
  connectionUUID!: string;

  public InstallRubixApp(
    hostUUID: string,
    appName: string,
    version: string): Promise<any> {
    return EdgeInstallApp(this.connectionUUID, hostUUID, appName, version);
  }

  public GetRubixAppVersions(
    hostUUID: string,
    appName: string,
    minVersion: string,
    maxVersion: string): Promise<any> {
    return EdgeRubixAppVersions(this.connectionUUID, hostUUID, appName, minVersion, maxVersion);
  }
}
