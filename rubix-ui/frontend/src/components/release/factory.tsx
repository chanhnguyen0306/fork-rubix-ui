import {installer, store} from "../../../wailsjs/go/models";
import {
  EdgeInstallApp,
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

  async GetRelease(uuid: string): Promise<store.Release> {
    return await GetRelease(uuid);
  }

  // install an app on the edge-device (the host)
  // example if installing flow-framework the user needs to already have this downloaded on the PC via the app-store
  // appName = flow-framework,  appVersion = v0.6.0, arch = amd64, releaseVersion = v0.6.0
  // to get the releaseVersion use either GetRelease() or GetReleases()
  async EdgeInstallApp(connUUID: string, hostUUID: string, appName: string, appVersion: string, arch: string, releaseVersion: string): Promise<installer.InstallResp> {
    return await EdgeInstallApp(connUUID, hostUUID, appName, appVersion, arch, releaseVersion);
  }

}
