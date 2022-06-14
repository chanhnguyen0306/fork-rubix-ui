import Form from "@rjsf/core";

export const JsonForm = (props: any) => {
  const { formData, setFormData, jsonSchema } = props;

  const handleFormChange = (values: any) => {
    setFormData(values.formData);
  };

  return (
    <div>
      <Form
        liveValidate
        formData={formData}
        schema={jsonSchema}
        onChange={handleFormChange}
        onError={(err) => console.log("error", err)}
        children={true} //hide submit button
        showErrorList={false}
      />
    </div>
  );
};
