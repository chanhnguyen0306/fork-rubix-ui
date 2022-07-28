import {assistmodel, store} from "../../../wailsjs/go/models";
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
        let out: Array<store.ReleaseList> = {} as Array<store.ReleaseList>;
        await GitListReleases(token)
            .then((res) => {
                out = res as Array<store.ReleaseList>
            })
            .catch((err) => {
                return out;
            });
        return out;
    }

    // download the selected version by the user from GitHub
    async GitDownloadRelease(token: string, version:string): Promise<store.Release> {
        let out = store.Release;
        await GitDownloadRelease(token, version)
            .then((res) => {
                out = res as store.Release;
            })
            .catch((err) => {
                return out;
            });
        return out;
    }

    // get all the release from the local json DB
    async GetAll(): Promise<Array<store.Release>> {
        let out: Array<store.Release> = {} as Array<store.Release>;
        await GetReleases()
            .then((res) => {
                out = res as Array<store.Release>
            })
            .catch((err) => {
                return out;
            });
        return out;
    }

    async GetOne(uuid: string): Promise<store.Release> {
        let out = store.Release;
        await GetRelease(uuid)
            .then((res) => {
                out = res as store.Release;
            })
            .catch((err) => {
                return out;
            });
        return out;
    }

    // token, appName, releaseVersion, arch string, cleanDownload bool
    async StoreDownload(token: string, appName: string, releaseVersion: string, arch: string, cleanDownload: boolean): Promise<any> {
        let out;
        await StoreDownloadApp(token, appName, releaseVersion, arch, cleanDownload)
            .then((res) => {
                out = res as store.Release;
            })
            .catch((err) => {
                return out;
            });
        return out;
    }


}
