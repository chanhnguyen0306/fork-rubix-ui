import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowPointFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-schema-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Point = model.Point;

export const CreateModal = (props: any) => {
  const {
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    deviceUUID,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Point);

  const factory = new FlowPointFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const add = async (point: Point) => {
    await factory.Add(deviceUUID, point);
  };

  const handleClose = () => {
    setFormData({} as Point);
    onCloseModal();
  };

  const handleSubmit = async (point: Point) => {
    setConfirmLoading(true);
    await add(point);
    refreshList();
    setConfirmLoading(false);
    handleClose();
  };

  return (
    <Modal
      title="Add New"
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      okText="Save"
      maskClosable={false}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          jsonSchema={schema}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </Spin>
    </Modal>
  );
};

export const CreateBulkModal = (props: any) => {
  const {
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    deviceUUID,
    schema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Point);
  const [bulkSchema, setbulkSchema] = useState({} as any);

  const factory = new FlowPointFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const add = async (points: Point[]) => {
    await factory.AddBulk(points);
  };

  const handleClose = () => {
    setFormData({} as Point);
    onCloseModal();
  };

  const handleSubmit = async (formData: any) => {
    try {
      setConfirmLoading(true);
      const { count } = formData;
      if (count && count > 0) {
        const points = [] as Point[];
        for (let i = 0; i < count; i++) {
          const point = { ...formData, device_uuid: deviceUUID };
          delete point.count;
          points.push(point);
        }
        await add(points);
        refreshList();
        handleClose();
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    //add count input
    if (!isLoadingForm) {
      const countSchema = {
        type: "number",
        title: "count",
        minimum: 1,
      };
      const bulkSchema = {
        properties: {
          count: countSchema,
          ...schema.properties,
        },
        required: ["count"],
      };
      setbulkSchema(bulkSchema);
    }
  }, [isLoadingForm]);

  return (
    <Modal
      title="Add New Bulk"
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      okText="Save"
      maskClosable={false}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          jsonSchema={bulkSchema}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </Spin>
    </Modal>
  );
};
