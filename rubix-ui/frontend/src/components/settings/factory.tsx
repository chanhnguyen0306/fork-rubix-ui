
import {  storage } from "../../../wailsjs/go/models";
import {
   GetGitToken, GetSetting,
   UpdateSettings,
} from "../../../wailsjs/go/main/App";

export class SettingsFactory {

  async GitToken(): Promise<string> {
    let out = "";
    await GetGitToken()
      .then((res) => {
        out = res as string;
      })
      .catch((err) => {
        return out;
      });
    return out;
  }


  async Get(): Promise<storage.Settings> {
    let out: any = storage.Settings;
    await GetSetting()
        .then((res) => {
          out = res as storage.Settings;
        })
        .catch((err) => {
          return out;
        });
    return out;
  }

  async Update(body: storage.Settings): Promise<storage.Settings> {
    let one: storage.Settings = {} as storage.Settings;
    await UpdateSettings(body)
      .then((res) => {
        one = res as storage.Settings;
      })
      .catch((err) => {
        return one;
      });
    return one;
  }

}
