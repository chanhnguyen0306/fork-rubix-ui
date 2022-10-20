import Form from "@rjsf/core";

export const JsonForm = (props: any) => {
  const { formData, setFormData, jsonSchema, uiSchema } = props;

  const handleFormChange = (values: any) => {
    setFormData(values.formData);
  };

  return (
    <Form
      liveValidate
      formData={formData}
      schema={jsonSchema ?? {}}
      uiSchema={uiSchema ?? {}}
      onChange={handleFormChange}
      onError={(err) => console.log("error", err)}
      children={true} //hide submit button
      showErrorList={false}
    />
  );
};
