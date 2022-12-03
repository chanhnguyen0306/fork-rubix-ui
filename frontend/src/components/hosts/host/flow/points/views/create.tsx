import { Checkbox, Form, Input, InputNumber, Modal, Spin, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
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
  inputType: "number" | "string" | "boolean";
  record: any;
  index: number;
  children: React.ReactNode;
}

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
  const [bulkSchema, setbulkSchema] = useState({} as any);
  const [count, setCount] = useState<any>(undefined);
  const [items, setItems] = useState<any[]>([]);
  const [form] = Form.useForm();

  const factory = new FlowPointFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const handleClose = () => {
    setItems([]);
    setCount(undefined);
    onCloseModal();
  };

  const onChange = (
    value: number | string | boolean,
    dataIndex: string,
    key: number
  ) => {
    items[key][dataIndex] = value;
    setItems(items);
  };

  const onCountChange = (count: number) => {
    setCount(count);
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    setItems(data);
    form.setFieldsValue({ items: data });
  };

  const handleSubmit = async () => {
    console.log(items);
  };

  const deleteItem = (key: number) => {
    const newItems = items.filter((i) => i.key !== key);
    const newCount = count - 1;
    setItems(newItems);
    !newCount ? setCount(undefined) : setCount(newCount);
  };

  const add = async (points: Point[]) => {
    await factory.AddBulk(points);
  };

  //will using schema to make columns
  const columns = [
    {
      title: "actions",
      dataIndex: "actions",
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: "center" }}>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => deleteItem(record.key)}
            />
          </div>
        );
      },
    },
    {
      title: "name",
      dataIndex: "name",
      editable: true,
      type: "string",
    },
    {
      title: "age",
      dataIndex: "age",
      editable: true,
      type: "number",
    },
    {
      title: "address",
      dataIndex: "address",
      editable: true,
      type: "string",
    },
  ];

  const mergedColumns = columns.map((col, index) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
        index: index,
      }),
    };
  });

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
    const defaultValue = record ? record[dataIndex] : null;
    let inputNode = null;
    switch (inputType) {
      case "number":
        inputNode = (
          <InputNumber
            defaultValue={defaultValue}
            onChange={(e) => onChange(e.target.value, dataIndex, record.key)}
          />
        );
        break;
      case "string":
        inputNode = (
          <Input
            defaultValue={defaultValue}
            onChange={(e) => onChange(e.target.value, dataIndex, record.key)}
          />
        );
        break;
      case "boolean":
        inputNode = (
          <Checkbox
            defaultChecked={defaultValue ?? false}
            onChange={(e: CheckboxChangeEvent) =>
              onChange(e.target.checked, dataIndex, record.key)
            }
          />
        );
        break;
    }

    return <td {...restProps}>{editing ? <>{inputNode}</> : children}</td>;
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
      onOk={handleSubmit}
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
        value={count}
      />
      <Spin spinning={isLoadingForm}>
        <Form form={form} component={false}>
          <Form.Item name="items">
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={items}
              columns={mergedColumns}
              rowClassName="editable-row"
            />
          </Form.Item>
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
