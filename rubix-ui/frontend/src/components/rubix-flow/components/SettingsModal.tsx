import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-schema-form";
import { FlowFactory } from "../factory";
import { useChangeNodeProprerties } from "../hooks/useChangeNodeData";
import { useNodes } from "react-flow-renderer";
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
  const handleChange = useChangeNodeProprerties(node.id);
  const [settings, setSettings] = useState({} as any);
  const [formData, setFormData] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const factory = new FlowFactory();

  useEffect(() => {
    fetchSchemaJson();
    fetchGetFlow();
  }, []);

  const fetchSchemaJson = async () => {
    setIsLoadingForm(true);
    const type = node.type.split("/")[1];
    const res = (await factory.NodeSchema(type)) || {};
    setSettings(res);
    setIsLoadingForm(false);
  };

  const fetchGetFlow = async () => {
    try {
      const _formData = {} as any;

      const _res = (await factory.GetFlow()) || {};
      const _node = _res.nodes.filter(
        (item: { id: string }) => item.id === node.id
      );

      const nodeMethod = _node[0]?.settings?.method || null;
      const nodeFunction = _node[0]?.settings?.function || null;
      nodeMethod && (_formData.method = nodeMethod);
      nodeFunction && (_formData.function = nodeFunction);

      setFormData(_formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (formData: any) => {
    handleChange("settings", formData);
    handleClose();
  };

  return (
    <Modal
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      okText="Save"
      okButtonProps={{}}
      onCancel={handleClose}
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
