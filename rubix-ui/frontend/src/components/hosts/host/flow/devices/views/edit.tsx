import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { FlowDeviceFactory } from "../factory";
import { model } from "../../../../../../../wailsjs/go/models";
import { JsonForm } from "../../../../../../common/json-schema-form";

import Device = model.Device;

export const EditModal = (props: any) => {
  const {
    currentItem,
    isModalVisible,
    isLoadingForm,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);
  const { connUUID = "", hostUUID = "" } = useParams();

  let flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const edit = async (device: Device) => {
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
