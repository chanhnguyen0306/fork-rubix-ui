import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowNetworkFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Network = model.Network;

export const EditModal = (props: any) => {
  const {
    currentItem,
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    networkSchema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  let flowNetworkFactory = new FlowNetworkFactory();

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const edit = async (net: Network) => {
    flowNetworkFactory.connectionUUID = connUUID;
    flowNetworkFactory.hostUUID = hostUUID;
    flowNetworkFactory.uuid = net.uuid;
    await flowNetworkFactory.Update(net);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (item: any) => {
    setConfirmLoading(true);
    await edit(item);
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  return (
    <>
      <Modal
        title={"Edit " + currentItem.name}
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
    </>
  );
};
