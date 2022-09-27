import { useEffect, useState } from "react";
import {
  useReactFlow,
  useNodesState,
  useNodes,
} from "react-flow-renderer/nocss";
import { useUpdateNodeInternals, useStore } from "react-flow-renderer";
import { Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-schema-form";
import { FlowFactory } from "../factory";

export const SettingsModal = (props: any) => {
  const { node, isModalVisible, onCloseModal } = props;
  const [settings, setSettings] = useState({} as any);
  const [formData, setFormData] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const factory = new FlowFactory();

  useEffect(() => {
    fetchSchemaJson();
  }, []);

  const fetchSchemaJson = async () => {
    setIsLoadingForm(true);
    const type = node.type.split("/")[1];
    const res = (await factory.NodeSchema(type)) || {};
    setSettings(res);
    setIsLoadingForm(false);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (formData: any) => {
    setConfirmLoading(true);
    console.log("formData", formData);
    setConfirmLoading(false);
    handleClose();
  };

  return (
    <Modal
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      okText="Save"
      okButtonProps={{}}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      maskClosable={false}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={settings.schema}
          uiSchema={settings.uiSchema}
        />
      </Spin>
    </Modal>
  );
};
