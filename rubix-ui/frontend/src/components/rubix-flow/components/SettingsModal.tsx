import { useEffect, useState } from "react";
import { useReactFlow } from "react-flow-renderer/nocss";
import { Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-schema-form";
import { FlowFactory } from "../factory";
import { NODES_JSON } from "../use-nodes-spec";
import { NodeJSON } from "../lib";

type SettingsModalProps = {
  isModalVisible: boolean;
  node: any;
  onCloseModal: () => void;
};

export const SettingsModal = ({
                                node,
                                isModalVisible,
                                onCloseModal,
                              }: SettingsModalProps) => {
  const instance = useReactFlow();
  const [settings, setSettings] = useState({} as any);
  const [formData, setFormData] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const nodeIds = instance.getNodes().map((n) => n.id);
  let nodesStorage = (JSON.parse("" + localStorage.getItem(NODES_JSON)) ||
    []) as NodeJSON[];
  nodesStorage = nodesStorage.filter((n) => nodeIds.includes(n.id));

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
    const updatedNode = { ...node, settings: formData };
    const index = nodesStorage.findIndex((n: any) => n.id == node.id);
    if (index === -1) {
      nodesStorage.push(updatedNode);
    } else {
      nodesStorage[index] = updatedNode;
    }
    localStorage.setItem(NODES_JSON, JSON.stringify(nodesStorage)); //use localStorage to store node-settings
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
