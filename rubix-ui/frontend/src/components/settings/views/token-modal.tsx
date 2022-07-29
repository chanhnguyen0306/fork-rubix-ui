import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { SettingsFactory } from "../factory";

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
      //   await factory.Update(body);
      setConfirmLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
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
