import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowDeviceFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-schema-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Device = model.Device;

export const CreateModal = (props: any) => {
  const {
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    networkUUID,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Device);

  let flowDeviceFactory = new FlowDeviceFactory();

  const add = async (device: Device) => {
    flowDeviceFactory.connectionUUID = connUUID;
    flowDeviceFactory.hostUUID = hostUUID;
    await flowDeviceFactory.Add(networkUUID, device);
  };

  const handleClose = () => {
    setFormData({} as Device);
    onCloseModal();
  };

  const handleSubmit = async (item: Device) => {
    setConfirmLoading(true);
    await add(item);
    refreshList();
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
      maskClosable={false}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          jsonSchema={schema}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </Spin>
    </Modal>
  );
};
