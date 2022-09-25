import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-schema-form";

type NodeSettings = {
  schema: {};
  uiSchema: {};
};

export const SettingsModal = (props: any) => {
  const { nodeId, isModalVisible, onCloseModal } = props;
  const [settings, setSettings] = useState({} as NodeSettings);
  const [formData, setFormData] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    fetchSchemaJson();
  }, []);

  const fetchSchemaJson = async () => {
    //call api fetch node Settings here
    setIsLoadingForm(true);
    const settings = {
      schema: {
        title: "Inputs Count",
        properties: {
          input_type: {
            type: "string",
            title: "input_type",
            enum: ["number", "float", "int"],
            enumNames: ["Number", "Float", "Int"],
            default: "number",
            value: "",
          },
          input_name: {
            type: "string",
            title: "input_name",
            maxLength: 20,
            minLength: 3,
            value: "",
          },
        },
      },
      uiSchema: {},
    }; //fake data
    setSettings(settings);
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
