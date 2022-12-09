import { Modal } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FlowPluginFactory } from "../factory";

export const PluginDownloadModal = (props: any) => {
  const { isModalVisible, handleClose, pluginName, refreshList } = props;
  const { connUUID = "", hostUUID = "" } = useParams();
  const [confirmLoading, setConfirmloading] = useState(false);

  const factory = new FlowPluginFactory();

  const handleDownload = () => {
    console.log(pluginName);
  };

  const installPlugin = async () => {
    await factory.InstallPlugin(connUUID, hostUUID, pluginName);
    refreshList();
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
