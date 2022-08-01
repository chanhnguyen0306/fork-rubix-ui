import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { SettingsFactory } from "../factory";
import { storage } from "../../../../wailsjs/go/models";

export const TokenModal = (props: any) => {
  const { isModalVisible, onClose } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [body, setBody] = useState("");

  const factory = new SettingsFactory();

  useEffect(() => {
    setBody("");
  }, [isModalVisible]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBody(e.target.value);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const payload = { theme: "dark", git_token: body };
      const res = await factory.Update(payload);
      // const res = await factory.Get();
      // const res = await factory.GitToken();
      console.log(res);

      onClose();
    } catch (error) {
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
      <Input placeholder="please enter token..." onChange={onChange} />
    </Modal>
  );
};
