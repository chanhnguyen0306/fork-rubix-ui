import { notification } from "antd";
import bacnetLogo from "../assets/images/BACnet_logo.png";
import nubeLogo from "../assets/images/Nube-logo.png";
import modbusLogo from "../assets/images/modbus.png";
import loraLogo from "../assets/images/lora.png";
import lorawanLogo from "../assets/images/lorawan.png";
import postgresLogo from "../assets/images/postgresql.png";
import historyLogo from "../assets/images/history.png";
import edge28 from "../assets/images/Edge-iO-28.png";
import rubixIO from "../assets/images/RC-IO.png";

type NotificationType = "success" | "info" | "warning" | "error";

export const openNotificationWithIcon = (type: NotificationType, data: any) => {
  notification[type]({
    message: "",
    description: data,
    placement:"bottomRight",
  });
};

export const isObjectEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
};


export function pluginLogo (plugin: string):string{
  let image = nubeLogo;``
  if (plugin == "bacnetmaster") {
    image = bacnetLogo;
  }
  if (plugin == "bacnet") {
    image = bacnetLogo;
  }
  if (plugin == "lora") {
    image = loraLogo;
  }
  if (plugin == "lorawan") {
    image = lorawanLogo;
  }
  if (plugin == "postgres") {
    image = postgresLogo;
  }
  if (plugin == "history") {
    image = historyLogo;
  }
  if (plugin == "modbus") {
    image = modbusLogo;
  }
  if (plugin == "history") {
    image = historyLogo;
  }
  if (plugin == "modbus-server") {
    image = modbusLogo;
  }
  if (plugin == "edge28") {
    image = edge28;
  }
  if (plugin == "rubix-io") {
    image = rubixIO;
  }
  return image
}


