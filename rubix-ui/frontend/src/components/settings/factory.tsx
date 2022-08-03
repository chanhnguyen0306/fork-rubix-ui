
import {  storage } from "../../../wailsjs/go/models";
import {
   GetGitToken, GetSetting,
   UpdateSettings,
} from "../../../wailsjs/go/main/App";

export class SettingsFactory {


  async GitTokenDecoded(uuid:string): Promise<string> {
    let out = "";
    await GetGitToken(uuid, false)
      .then((res) => {
        out = res as string;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }


  async GitToken(uuid:string): Promise<string> {
    let out = "";
    await GetGitToken(uuid, true)
      .then((res) => {
        out = res as string;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }


  async Get(uuid:string): Promise<storage.Settings> {
    let out: any = storage.Settings;
    await GetSetting(uuid)
        .then((res:any) => {
          out = res as storage.Settings;
        })
        .catch((err: any) => {
          return out;
        });
    return out;
  }

  async Update(uuid: string, body: storage.Settings): Promise<storage.Settings> {
    let one: storage.Settings = {} as storage.Settings;
    await UpdateSettings(uuid, body)
      .then((res: any) => {
        one = res as storage.Settings;
      })
      .catch((err: any) => {
        return one;
      });
    return one;
  }

}
