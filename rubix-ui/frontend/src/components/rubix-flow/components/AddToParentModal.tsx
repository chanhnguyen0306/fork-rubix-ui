import { useEffect, useState } from "react";
import { Node, useReactFlow } from "react-flow-renderer/nocss";
import { Modal, Spin } from "antd";
import { JsonForm } from "../../../common/json-schema-form";
import { FlowFactory } from "../factory";
import { FLOW_TYPE, NODES_JSON } from "../use-nodes-spec";
import { NodeJSON } from "../lib";
import { title } from "case";

type AddToParentModalProps = {
  isModalVisible: boolean;
  node: any;
  onCloseModal: () => void;
};

export const AddToParentModal = ({
  node,
  isModalVisible,
  onCloseModal,
}: AddToParentModalProps) => {
  const instance = useReactFlow();
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    fetchSchemaJson();
  }, []);

  const fetchSchemaJson = () => {
    setIsLoadingForm(true);
    const parentNodes = setParentNodes();
    const schema = {
      title: `Select Parent Node`,
      properties: {
        parentNode: {
          type: "string",
          title: "parent",
          enum: parentNodes.map((np) => np.id),
          enumNames: parentNodes.map((np) => np.id),
        },
      },
    };
    setSchema(schema);
    setIsLoadingForm(false);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (formData: any) => {
    console.log(formData);
    handleClose();
  };

  const setParentNodes = () => {
    const nodes = instance.getNodes();
    let parentNodes: Node<any>[] = [];
    switch (node.type) {
      case FLOW_TYPE.DEVICE:
        parentNodes = nodes.filter((n) => n.type === FLOW_TYPE.NETWORK);
        break;
      case FLOW_TYPE.POINT:
        parentNodes = nodes.filter((n) => n.type === FLOW_TYPE.DEVICE);
        break;
    }
    return parentNodes;
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
          jsonSchema={schema}
        />
      </Spin>
    </Modal>
  );
};
