import { Modal } from "antd";

export const PluginDownloadModal = (props: any) => {
  const { isModalVisible, confirmLoading, handleClose } = props;

  const handleDownload = (item: any) => {
    console.log(item);
  };

  return (
    <Modal
      title="Download"
      visible={isModalVisible}
      onOk={handleDownload}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      okText="Download"
      cancelText="Close"
      maskClosable={false}
      style={{ textAlign: "start" }}
    ></Modal>
  );
};
