import { useEffect, useState } from "react";
import { SettingsFactory } from "./factory";
import { SettingUUID } from "../../constants/constants";

const _settings = {
  auto_refresh_enable: false,
  auto_refresh_rate: 5000,
  git_token: "",
  theme: "dark",
  uuid: SettingUUID,
} as any;

const factory = new SettingsFactory();

export const getSettings = () => _settings;

export const useSettings = () => {
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    fetch(settings.uuid);
  }, [settings.uuid]);

  const fetch = async (uuid: string) => {
    try {
      let res = await factory.Get(uuid);
      if (!res) {
        res = getSettings();
      }
      setSettings(res);
    } catch (error) {
      console.log(error);
    }
  };

  return [settings, setSettings];
};
