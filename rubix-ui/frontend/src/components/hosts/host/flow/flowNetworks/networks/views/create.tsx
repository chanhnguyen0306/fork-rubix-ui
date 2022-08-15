import { Button, Modal, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { assistmodel, model } from "../../../../../../../../wailsjs/go/models";
import { AddHost, EditHost } from "../../../../../../../../wailsjs/go/main/App";
import { openNotificationWithIcon } from "../../../../../../../utils/utils";
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

  let factory = new FlowFrameworkNetworkFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [isModalVisible]);

  const handleSubmit = async (network: FlowNetwork) => {
    setConfirmLoading(true);
    if (currentItem.uuid) {
      network.uuid = currentItem.uuid;
      await factory.Update(network.uuid, network);
    } else {
      await factory.Add(network);
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
