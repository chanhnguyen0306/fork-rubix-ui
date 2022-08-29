import { useState, useEffect } from "react";
import { SettingsFactory } from "./factory";

const _settings = {
  auto_refresh_enable: false,
  auto_refresh_rate: 5000,
  git_token: "",
  theme: "dark",
  uuid: "set_123456789ABC",
} as any;

const factory = new SettingsFactory();

export const getSettings = () => _settings;

export const useSettings = () => {
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    fetch(settings.uuid);
  }, [settings.uuid]);

  const fetch = async (uuid: string) => {
    console.log(11111);

    try {
      const res = await factory.Get(uuid);
      setSettings(res);
    } catch (error) {
      console.log(error);
    }
  };

  return [settings, setSettings];
};
