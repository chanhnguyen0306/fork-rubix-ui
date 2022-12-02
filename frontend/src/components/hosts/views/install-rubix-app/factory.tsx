import {
  EdgeInstallApp, EdgeListPlugins,
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
    let res = EdgeListPlugins(this.connectionUUID, hostUUID).then(res=> {
      console.log("res", res.data)
      console.log("res", res.msg)
    })

    return EdgeRubixAppVersions(this.connectionUUID, hostUUID, appName, minVersion, maxVersion);
  }
}
