import { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { FlowDeviceFactory } from "../factory";
import { model } from "../../../../../../../wailsjs/go/models";
import { JsonForm } from "../../../../../../common/json-schema-form";

import Device = model.Device;

export const CreateModal = (props: any) => {
  const { isModalVisible, isLoadingForm, schema, onCloseModal, refreshList } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Device);
  const { connUUID = "", networkUUID = "", hostUUID = "" } = useParams();

  let flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = hostUUID;

  const add = async (device: Device) => {
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
