import { Form, Input, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

export const CreateEditModal = (props: any) => {
  const {
    currentItem,
    isModalVisible,
    isLoadingForm,
    refreshList,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  useEffect(() => {
    setFormData(currentItem);
    console.log(currentItem);
  }, [currentItem]);

  const edit = async (item: any) => {
    console.log("edit", item);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = (item: any) => {
    setConfirmLoading(true);
    edit(item);
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  return (
    <>
      <Modal
        title={"Edit " + currentItem.name}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="Save"
        style={{ textAlign: "start" }}
      >
        <Spin spinning={isLoadingForm}>
          <Form
            fields={[{ name: ["name"], value: currentItem.name }]}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item name="name" label="name">
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
