import { useEffect, useState } from "react";
import { openNotificationWithIcon } from "../../../utils/utils";
import { Button, Collapse, Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-form";
import { storage } from "../../../../wailsjs/go/models";
import { PlusOutlined } from "@ant-design/icons";
import RubixConnection = storage.RubixConnection;
import { ConnectionFactory } from "../../connections/factory";
const { Panel } = Collapse;

export const CreateModal = (props: any) => {
  const { connetions, refreshList, isModalVisible, setIsModalVisible } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(connetions);
  const [schema, setSchema] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let factory = new ConnectionFactory();

  useEffect(() => {
    getSchema();
  }, []);

  useEffect(() => {
    setFormData(connetions);
  }, [connetions]);

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await factory.Schema();
    const jsonSchema = {
      properties: res,
    };
    setSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const addConnection = async (connection: RubixConnection) => {
    factory.this = connection;
    try {
      const res = await factory.Add();
      if (res.uuid) {
        openNotificationWithIcon("success", `added ${connection.name} success`);
      } else {
        openNotificationWithIcon("error", `added ${connection.name} fail`);
      }
    } catch (err) {
      openNotificationWithIcon("error", err);
      console.log(err);
    }
  };

  const handleClose = () => {
    setFormData({} as RubixConnection);
    setIsModalVisible(false);
  };

  const handleSubmit = (connection: RubixConnection) => {
    setConfirmLoading(true);
    addConnection(connection);
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  return (
    <Modal
      title="Add New Connections"
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      okText="Save"
      confirmLoading={confirmLoading}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="192.168.15.194" key="1">
            <JsonForm
              formData={{ ip: "192.168.15.194" }}
              jsonSchema={schema}
              setFormData={setFormData}
            />
          </Panel>
        </Collapse>
      </Spin>
    </Modal>
  );
};

export const AddButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal()}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Add
    </Button>
  );
};
