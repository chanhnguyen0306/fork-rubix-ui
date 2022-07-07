import { Modal, Spin } from "antd";
import { useState } from "react";
import { FlowPointFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Point = model.Point;

export const CreateModal = (props: any) => {
  const {
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    deviceUUID,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Point);

  let factory = new FlowPointFactory();

  const add = async (point: Point) => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.Add(deviceUUID, point);
  };

  const handleClose = () => {
    setFormData({} as Point);
    onCloseModal();
  };

  const handleSubmit = async (point: Point) => {
    setConfirmLoading(true);
    await add(point);
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
