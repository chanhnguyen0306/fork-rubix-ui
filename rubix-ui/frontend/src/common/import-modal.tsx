import { Input, Modal } from "antd";
import { useState } from "react";
const { TextArea } = Input;

export const ImportModal = (props: any) => {
  const { isModalVisible, onClose, onConfirm } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [body, setBody] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const body = e.target.value;
    setBody(body);
  };

  return (
    <Modal
      title="Import"
      okText="Save"
      onOk={() => onConfirm(body)}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      visible={isModalVisible}
      maskClosable={false} // prevent modal from closing on click outside
      style={{ textAlign: "start" }}
    >
      <TextArea
        rows={15}
        onChange={onChange}
        placeholder="please import a json..."
      />
    </Modal>
  );
};
