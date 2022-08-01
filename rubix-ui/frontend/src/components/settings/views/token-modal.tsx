import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { SettingsFactory } from "../factory";
import { getDarkMode } from "../../../themes/use-theme";
import { openNotificationWithIcon } from "../../../utils/utils";

export const TokenModal = (props: any) => {
  const { isModalVisible, onClose } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [token, setToken] = useState("");
  const _darkMode = getDarkMode();
  const factory = new SettingsFactory();

  const uuid = "set_123456789ABC"

  useEffect(() => {
    GetSetting();
  }, [isModalVisible]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setToken(e.target.value);
  };

  const GetSetting = async () => {
    try {
      const gitToken = await factory.GitToken(uuid);
      gitToken ? setToken(gitToken) : setToken("");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const payload = { uuid: uuid,  theme: _darkMode ? "dark" : "light", git_token: token };
      await factory.Update(uuid, payload);
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
