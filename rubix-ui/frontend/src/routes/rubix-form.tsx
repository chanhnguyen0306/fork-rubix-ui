import { Form, Input } from "antd";
import { useState } from "react";
import { model } from "../../wailsjs/go/models";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export const RubixForm = (props: any) => {
  const { form, formData, setFormData } = props;

  const handleFormChange = (inputValue: any, values: any) => {
    setFormData(values);
  };

  return (
    <div>
      <Form
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
      </Form>
    </div>
  );
};
