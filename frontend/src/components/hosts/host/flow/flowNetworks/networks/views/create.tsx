import { Modal } from "antd";
import { useEffect, useState } from "react";
import { model } from "../../../../../../../../wailsjs/go/models";

import { JsonForm } from "../../../../../../../common/json-schema-form";
import { FlowFrameworkNetworkFactory } from "../factory";
import { useParams } from "react-router-dom";

import FlowNetwork = model.FlowNetwork;

export const CreateEditModal = (props: any) => {
  const { schema, currentItem, isModalVisible, refreshList, onCloseModal } =
    props;
  const { connUUID = "", hostUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  const factory = new FlowFrameworkNetworkFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [isModalVisible]);

  const handleSubmit = async (network: FlowNetwork) => {
    try {
      setConfirmLoading(true);
      if (currentItem.uuid) {
        network.uuid = currentItem.uuid;
        await factory.Update(network.uuid, network);
      } else {
        await factory.Add(network);
      }
      refreshList();
      onCloseModal();
    } catch (error) {
    } finally {
      setConfirmLoading(false);
    }
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
