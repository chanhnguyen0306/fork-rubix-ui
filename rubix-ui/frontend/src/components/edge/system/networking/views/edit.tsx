import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { main } from "../../../../../../wailsjs/go/models";
import { JsonForm } from "../../../../../common/json-schema-form";
import { HostNetworkingFactory } from "../factory";

import RcNetworkBody = main.RcNetworkBody;

export const EditModal = (props: any) => {
  const { currentItem, isModalVisible, schema, onCloseModal, refreshList } =
    props;
  const { connUUID = "", hostUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  const factory = new HostNetworkingFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (item: RcNetworkBody) => {
    const res = await factory.RcSetNetworks(item);
    console.log(res);
    refreshList();
  };

  return (
    <>
      <Modal
        title={"Edit " + currentItem.name}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
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
