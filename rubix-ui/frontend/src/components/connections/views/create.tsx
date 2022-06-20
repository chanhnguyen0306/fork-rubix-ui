import { useEffect, useState } from "react";
import { openNotificationWithIcon } from "../../../utils/utils";
import { Button, Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-form";
import { storage } from "../../../../wailsjs/go/models";
import RubixConnection = storage.RubixConnection;
import { PlusOutlined } from "@ant-design/icons";
import { ConnectionFactory } from "../factory";

export const CreateEditModal = (props: any) => {
  const {
    currentConnection,
    connectionSchema,
    isModalVisible,
    isLoadingForm,
    refreshList,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentConnection);
  let factory = new ConnectionFactory();

  useEffect(() => {
    setFormData(currentConnection);
  }, [currentConnection]);

  const addConnection = async (connection: RubixConnection) => {
    factory.this = connection;
    try {
      const res = await factory.Add();
      if (res.uuid) {
        refreshList();
        openNotificationWithIcon("success", `added ${connection.name} success`);
      } else {
        openNotificationWithIcon("error", `added ${connection.name} fail`);
      }
    } catch (err) {
      openNotificationWithIcon("error", err);
      console.log(err);
    }
  };

  const editConnection = async (connection: RubixConnection) => {
    factory.this = connection;
    factory.uuid = connection.uuid;
    const res = factory.Update();
    refreshList();
  };

  const handleClose = () => {
    setFormData({} as RubixConnection);
    onCloseModal();
  };

  const handleSubmit = (connection: RubixConnection) => {
    setConfirmLoading(true);
    if (currentConnection.uuid) {
      connection.uuid = currentConnection.uuid;
      editConnection(connection);
    } else {
      addConnection(connection);
    }
    setConfirmLoading(false);
    handleClose();
  };

  const isDisabled = (): boolean => {
    let result = false;
    result =
      !formData.name ||
      (formData.name &&
        (formData.name.length < 2 || formData.name.length > 50));
    return result;
  };

  return (
    <Modal
      title={
        currentConnection.uuid
          ? "Edit " + currentConnection.name
          : "Add New Connection"
      }
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      okText="Save"
      okButtonProps={{
        disabled: isDisabled(),
      }}
      confirmLoading={confirmLoading}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={connectionSchema}
        />
      </Spin>
    </Modal>
  );
};

export const AddButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as RubixConnection)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Connection
    </Button>
  );
};
