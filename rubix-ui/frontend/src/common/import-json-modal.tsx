import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
const { TextArea } = Input;

export const ImportJsonModal = (props: any) => {
  const { isModalVisible, onClose, onOk } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [body, setBody] = useState("");

  useEffect(() => {
    setBody("");
  }, [isModalVisible]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBody(e.target.value);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await onOk(body);
    setConfirmLoading(false);
  };

  return (
    <Modal
      title="Import"
      visible={isModalVisible}
      okText="Save"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      maskClosable={false} // prevent modal from closing on click outside
      style={{ textAlign: "start" }}
    >
      <TextArea
        rows={12}
        onChange={onChange}
        placeholder="please import a json..."
        value={body}
      />
    </Modal>
  );
};
