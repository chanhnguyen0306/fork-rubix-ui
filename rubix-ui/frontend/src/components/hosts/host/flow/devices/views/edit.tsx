import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowDeviceFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Device = model.Device;

export const EditModal = (props: any) => {
  const {
    currentItem,
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  let flowDeviceFactory = new FlowDeviceFactory();

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const edit = async (device: Device) => {
    flowDeviceFactory.connectionUUID = connUUID;
    flowDeviceFactory.hostUUID = hostUUID;
    await flowDeviceFactory.Update(device.uuid, device);
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
        maskClosable={false}
        style={{ textAlign: "start" }}
      >
        <Spin spinning={isLoadingForm}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={schema}
          />
        </Spin>
      </Modal>
    </>
  );
};
