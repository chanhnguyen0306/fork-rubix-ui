import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { SettingsFactory } from "../factory";
import { openNotificationWithIcon } from "../../../utils/utils";
import { storage } from "../../../../wailsjs/go/models";
import { useSettings } from "../use-settings";

export const TokenModal = (props: any) => {
  const { isModalVisible, onClose } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [token, setToken] = useState("");
  const [settings, setSettings] = useSettings();

  const factory = new SettingsFactory();

  useEffect(() => {
    getToken();
  }, [isModalVisible]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setToken(e.target.value);
  };

  const getToken = async () => {
    try {
      const gitToken = await factory.GitToken(settings.uuid);
      gitToken ? setToken(gitToken) : setToken("");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const payload = {
        ...settings,
        git_token: token,
      } as storage.Settings;
      const res = await factory.Update(settings.uuid, payload);
      setSettings(res);
      openNotificationWithIcon("success", "Update Token Successful!");
      onClose();
    } catch (error) {
      setToken("");
      console.log(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Token Update"
      centered
      width={1000}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={confirmLoading}
    >
      <Input
        placeholder="please enter token..."
        onChange={onChange}
        value={token}
      />
    </Modal>
  );
};
