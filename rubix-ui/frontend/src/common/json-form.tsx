import Form from "@rjsf/core";
export const JsonForm = (props: any) => {
  const { formData, locationSchema, setFormData } = props;
  const handleFormChange = (values: any) => {
    setFormData(values.formData);
  };

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
        showErrorList={false}
      />
    </div>
  );
};
