import React from "react";
import Modal from "antd/lib/modal/Modal";

interface RbModalProps {
  title: string | React.ReactElement;
  children: React.ReactElement;
  isOpen: boolean;
  close: () => any;
  isLoading: boolean;
  handleOk: () => any;
  disabled: boolean;
}

function RbModal(props: RbModalProps) {
  const { title, children, isOpen, close, isLoading, handleOk, disabled } =
    props;
  return (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={close}
      onOk={handleOk}
      confirmLoading={isLoading}
      style={{ textAlign: "start" }}
      okButtonProps={{
        disabled: disabled,
      }}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
}

export default RbModal;
