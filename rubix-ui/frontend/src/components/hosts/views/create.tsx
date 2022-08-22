import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { AddHost, EditHost } from "../../../../wailsjs/go/main/App";
import { openNotificationWithIcon } from "../../../utils/utils";
import { JsonForm } from "../../../common/json-schema-form";
import { assistmodel } from "../../../../wailsjs/go/models";

export const CreateEditModal = (props: any) => {
  const {
    hosts,
    hostSchema,
    currentHost,
    isModalVisible,
    isLoadingForm,
    onCloseModal,
    connUUID,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentHost);

  useEffect(() => {
    setFormData(currentHost);
  }, [currentHost]);

  const addHost = async (host: assistmodel.Host) => {
    try {
      await AddHost(connUUID, host);
      openNotificationWithIcon("success", `added ${host.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `added ${host.name} fail`);
    }
  };

  const editHost = async (host: assistmodel.Host) => {
    try {
      await EditHost(connUUID, host.uuid, host);
      hosts.findIndex((n: assistmodel.Host) => n.uuid === host.uuid);
      openNotificationWithIcon("success", `updated ${host.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `updated ${host.name} fail`);
    }
  };

  const handleClose = () => {
    setFormData({} as assistmodel.Host);
    onCloseModal();
  };

  const handleSubmit = async (host: assistmodel.Host) => {
    setConfirmLoading(true);
    if (currentHost.uuid) {
      host.uuid = currentHost.uuid;
      await editHost(host);
    } else {
      await addHost(host);
    }
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  return (
    <>
      <Modal
        title={currentHost.uuid ? "Edit " + currentHost.name : "New Host"}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="Save"
        maskClosable={false} // prevent modal from closing on click outside
        style={{ textAlign: "start" }}
      >
        <Spin spinning={isLoadingForm}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={hostSchema}
          />
        </Spin>
      </Modal>
    </>
  );
};
