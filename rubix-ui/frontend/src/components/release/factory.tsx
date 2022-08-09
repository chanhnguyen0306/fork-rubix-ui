import { assistmodel, store } from "../../../wailsjs/go/models";
import {
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

  // get all the release from the local json DB
  async GetAll(): Promise<Array<store.Release>> {
    return await GetReleases();
  }

  async GetOne(uuid: string): Promise<store.Release> {
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
}

// get new release click
// let me select the v1
