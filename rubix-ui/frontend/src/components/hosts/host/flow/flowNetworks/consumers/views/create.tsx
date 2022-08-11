import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import { FlowConsumerFactory } from "../factory";
import { model } from "../../../../../../../../wailsjs/go/models";
import { JsonForm } from "../../../../../../../common/json-schema-form";

import Consumer = model.Consumer;

export const CreateEditModal = (props: any) => {
  const { schema, currentItem, isModalVisible, refreshList, onCloseModal } =
    props;
  const { connUUID = "", hostUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  let factory = new FlowConsumerFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [isModalVisible]);

  const handleSubmit = async (item: Consumer) => {
    setConfirmLoading(true);
    if (currentItem.uuid) {
      item.uuid = currentItem.uuid;
      await factory.Update(item.uuid, item);
    } else {
      await factory.Add(item);
    }
    setConfirmLoading(false);
    refreshList();
    onCloseModal();
  };

  return (
    <>
      <Modal
        title={currentItem.uuid ? "Edit " + currentItem.name : "Add"}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={onCloseModal}
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
