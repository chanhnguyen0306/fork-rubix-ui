import Form from "@rjsf/core";
import { Input } from "antd";
import { useState } from "react";
import { model } from "../../wailsjs/go/models";

export const JsonForm = (props: any) => {
  const { form, formData, locationSchema, setFormData } = props;
  const handleFormChange = (values: any) => {
    setFormData(values.formData);
  };

  const schema = {
    properties: {
      uuid: {
        type: "string",
        title: "UUID",
        readOnly: true,
        default: "loc_1BE22B9BF1F5",
      },
      name: {
        type: "string",
        title: "Name",
        minLength: 2,
        maxLength: 50,
        default: "Rubix Location",
      },
      description: {
        type: "string",
        title: "Description",
        default: "haluhaluhaliu update",
      },
    },
    required: ["name"],
  } as {};

  const log = (type: any) => console.log.bind(console, type);

  return (
    <div>
      <Form
        liveValidate
        formData={formData}
        schema={schema}
        onChange={handleFormChange}
        onError={log("errors")}
        children={true} //hide submit button
      />
    </div>
  );
};
