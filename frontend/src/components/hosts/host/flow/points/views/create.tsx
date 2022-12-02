import { Form, Input, InputNumber, Modal, Spin, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { FlowPointFactory } from "../factory";
import { JsonForm } from "../../../../../../common/json-schema-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Point = model.Point;
import React from "react";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: any;
  index: number;
  children: React.ReactNode;
}

const originData: any[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  if (record) {
    const defaultValue = record[dataIndex];
    inputNode =
      inputType === "number" ? (
        <InputNumber defaultValue={defaultValue} />
      ) : (
        <Input defaultValue={defaultValue} />
      );
  }

  return (
    <td {...restProps}>
      {title ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
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
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: any) => record.key === editingKey;

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

  const onCountChange = (value: number) => {
    console.log("changed", value);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "actions",
      dataIndex: "actions",
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: "center" }}>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => console.log(record)}
            />
          </div>
        );
      },
      class: "aaaa",
    },
    {
      title: "name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      editable: true,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
      width={800}
    >
      <InputNumber
        min={1}
        onChange={onCountChange}
        style={{ width: "100%", marginBottom: "1.5rem" }}
        placeholder="please enter count"
      />
      <Spin spinning={isLoadingForm}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </Spin>
    </Modal>
  );
};

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
