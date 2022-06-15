import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export const openNotificationWithIcon = (type: NotificationType, data: any) => {
  notification[type]({
    message: "",
    description: data,
  });
};

export const isObjectEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
};
