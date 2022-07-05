import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowPluginFactory } from "../factory";
import { model } from "../../../../../../../wailsjs/go/models";

import Network = model.Network;
import { FlowNetworkFactory } from "../../networks/factory";
import { JsonForm } from "../../../../../../common/json-form";

export const CreateModal = (props: any) => {
  const {
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    networkSchema,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({});

  let factory = new FlowPluginFactory();
  let flowNetworkFactory = new FlowNetworkFactory();

  useEffect(() => {
    setFormData({});
  }, []);

  const addNetwork = async (net: Network) => {
    flowNetworkFactory.connectionUUID = connUUID;
    flowNetworkFactory.hostUUID = hostUUID;
    flowNetworkFactory.Add(net);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (item: any) => {
    setConfirmLoading(true);
    await addNetwork(item);
    setConfirmLoading(false);
    handleClose();
  };

  return (
    <Modal
      title="Add New"
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      okText="Save"
      maskClosable={false} // prevent modal from closing on click outside
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={networkSchema}
        />
      </Spin>
    </Modal>
  );
};
