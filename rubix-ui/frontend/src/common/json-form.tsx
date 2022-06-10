import { Input } from "antd";
import { useState } from "react";
import { model } from "../../wailsjs/go/models";
import Form from "@rjsf/core";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export const JsonForm = (props: any) => {
  const { form, formData, setFormData } = props;
  const handleFormChange = (inputValue: any, values: any) => {
    setFormData(values);
    console.log(values);
  };

  const schema = {
    title: "Todo",
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string", title: "Title", default: "A new task" },
      done: { type: "boolean", title: "Done?", default: false },
    },
  } as {};

  const log = (type: any) => console.log.bind(console, type);

  return (
    <div>
      {/* <Form
        {...formItemLayout}
        form={form}
        initialValues={formData}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Name aaa"
          name="name"
          rules={[
            { required: true, message: "Name is required!" },
            { min: 2, message: "Name must be minimum 2 characters." },
            { max: 50, message: "Name must be maximum 50 characters." },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
      </Form> */}
      <Form
        schema={schema}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")}
      />
    </div>
  );
};
