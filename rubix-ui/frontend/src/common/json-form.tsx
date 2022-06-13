import Form from "@rjsf/core";

export const JsonForm = (props: any) => {
  const { formData, setFormData, jsonSchema } = props;

  const handleFormChange = (values: any) => {
    setFormData(values.formData);
  };

  const schema = {
    properties: {
      uuid: {
        type: "string",
        title: "uuid",
        readOnly: true,
      },
      name: {
        type: "string",
        title: "name",
        minLength: 2,
        maxLength: 50,
      },
      description: {
        type: "string",
        title: "description",
      },
      enable: {
        type: "boolean",
        title: "enable",
      },
      product: {
        type: "string",
        title: "product",
        enum: [
          "RubixCompute",
          "RubixCompute5",
          "RubixComputeIO",
          "Edge28",
          "Nuc",
          "AllLinux",
        ],
        enumNames: [
          "RubixCompute",
          "RubixCompute5",
          "RubixComputeIO",
          "Edge28",
          "Nuc",
          "AllLinux",
        ],
        help: "a nube product type or a general linux server",
      },
      network_uuid: {
        type: "string",
        title: "network uuid",
        readOnly: true,
      },
      ip: {
        type: "string",
        title: "ip address",
        default: "192.168.15.10",
        help: "ip address, eg 192.168.15.10 or nube-io.com (https:// is not needed in front of the address)",
      },
      port: {
        type: "number",
        title: "port",
        minLength: 2,
        maxLength: 65535,
        default: 1662,
        help: "ip port, eg port 8080 192.168.15.10:8080",
      },
      https: {
        type: "boolean",
        title: "enable https",
      },
      username: {
        type: "string",
        title: "username",
        minLength: 1,
        maxLength: 50,
        default: "admin",
      },
      password: {
        type: "string",
        title: "password",
      },
      required: ["name", "ip", "port"],
    },
  } as {}; //locationSchema

  return (
    <div>
      <Form
        liveValidate
        formData={formData}
        schema={schema}
        onChange={handleFormChange}
        onError={(err) => console.log("error", err)}
        children={true} //hide submit button
        showErrorList={false}
      />
    </div>
  );
};
