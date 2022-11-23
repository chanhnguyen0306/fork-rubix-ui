import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowPointFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-schema-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Point = model.Point;

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
  const [formData, setFormData] = useState({} as any);

  const factory = new FlowPointFactory();

  const edit = async (point: Point) => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.Update(point.uuid, point);
  };

  const handleClose = () => {
    onCloseModal();
  };

  const handleSubmit = async (item: Point) => {
    setConfirmLoading(true);
    await edit(item);
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

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
