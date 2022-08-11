import {installer, store} from "../../../wailsjs/go/models";
import {
  AppInstallAppOnEdge,
  GetRelease,
  GetReleases,
  GitDownloadRelease,
  GitListReleases,
  StoreDownloadApp,
} from "../../../wailsjs/go/main/App";

export class ReleasesFactory {
  // list all the GitHub version to the user
  async GitReleases(token: string): Promise<Array<store.ReleaseList>> {
    return await GitListReleases(token);
  }

  // download the selected version by the user from GitHub
  async GitDownloadRelease(
    token: string,
    version: string
  ): Promise<store.Release> {
    return await GitDownloadRelease(token, version);
  }


  async GetRelease(uuid: string): Promise<store.Release> {
    return await GetRelease(uuid);
  }

  // token, appName, releaseVersion, arch string, cleanDownload bool
  async StoreDownload(
    token: string,
    appName: string,
    releaseVersion: string,
    arch: string,
    cleanDownload: boolean
  ): Promise<any> {
    return await StoreDownloadApp(
      token,
      appName,
      releaseVersion,
      arch,
      cleanDownload
    );
  }

  /*
  INSTALL A APP ON THE HOST (via rubix-assist via rubix-edge)
  */

  // let the user select a release that has been downloaded already on their PC (in local db)
  async GetReleases(): Promise<Array<store.Release>> {
    return await GetReleases();
  }

  // install an app on the edge-device (the host)
  // appName = flow-framework,  appVersion = v0.6.0, arch = amd64, releaseVersion = v0.6.0
  async AppInstallAppOnEdge(connUUID: string, hostUUID: string, appName: string, appVersion: string, arch: string, releaseVersion: string): Promise<installer.InstallResp> {
    return await AppInstallAppOnEdge(connUUID, hostUUID, appName, appVersion, arch, releaseVersion);
  }

}
