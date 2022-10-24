import { Modal } from "antd";
import { useState, useEffect } from "react";
import { db } from "../../../../wailsjs/go/models";
import { JsonForm } from "../../../common/json-schema-form";
import { FlowFactory } from "../../rubix-flow/factory";
import Connection = db.Connection;

export const EditModal = (props: any) => {
  const { currentItem, isModalVisible, schema, onCloseModal, refreshList } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  const factory = new FlowFactory();

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const edit = async (conenction: Connection) => {
    await factory.UpdateWiresConnection(conenction.uuid, conenction);
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
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={schema}
        />
      </Modal>
    </>
  );
};
