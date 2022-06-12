import Form from "@rjsf/core";

export const JsonForm = (props: any) => {
  const { formData, setFormData, jsonSchema } = props;

  const handleFormChange = (values: any) => {
    setFormData(values.formData);
    console.log(formData);
  };

  // const schema = {
  //   properties: {
  //     uuid: {
  //       type: "string",
  //       title: "UUID",
  //       readOnly: true,
  //       default: "",
  //     },
  //     name: {
  //       type: "string",
  //       title: "Name",
  //       minLength: 2,
  //       maxLength: 50,
  //       default: "",
  //     },
  //     description: {
  //       type: "string",
  //       title: "Description",
  //       default: "",
  //     },
  //   },
  //   required: ["name"],
  // } as {}; //locationSchema

  const schema = {
    properties: {
      uuid: {
        type: "string",
        title: "UUID",
        readOnly: true,
        default: "",
      },
      name: {
        type: "string",
        title: "Name",
        minLength: 2,
        maxLength: 50,
        default: "",
      },
      description: {
        type: "string",
        title: "Description",
        default: "",
      },
      location_uuid: {
        type: "string",
        title: "Location",
        enum: ["location_uuid_1", "location_uuid_2", "location_uuid_3"],
        enumNames: ["location 1", "location 2", "location 3"],
      },
    },
    required: ["name", "location_uuid"],
  } as {}; //networkSchema

  const log = (type: any) => console.log.bind(console, type);

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
