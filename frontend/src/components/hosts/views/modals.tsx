import { Select, Modal, Spin, Card, Row, Col, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AddHost, EditHost, OpenURL } from "../../../../wailsjs/go/backend/App";
import { amodel, storage } from "../../../../wailsjs/go/models";
import { JsonForm } from "../../../common/json-schema-form";
import { openNotificationWithIcon } from "../../../utils/utils";
import { BackupFactory } from "../../backups/factory";

import Host = amodel.Host;
import Backup = storage.Backup;

const { Option } = Select;
const actionRow: React.CSSProperties = { margin: "8px 0" };
const buttonStyle: React.CSSProperties = { width: "90%" };

export const CreateEditModal = (props: any) => {
  const { connUUID = "" } = useParams();
  const {
    hosts,
    hostSchema,
    currentHost,
    isModalVisible,
    isLoadingForm,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentHost);

  useEffect(() => {
    setFormData(currentHost);
  }, [currentHost]);

  const addHost = async (host: Host) => {
    try {
      await AddHost(connUUID, host);
      openNotificationWithIcon("success", `added ${host.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `added ${host.name} fail`);
    }
  };

  const editHost = async (host: Host) => {
    try {
      await EditHost(connUUID, host.uuid, host);
      hosts.findIndex((n: Host) => n.uuid === host.uuid);
      openNotificationWithIcon("success", `updated ${host.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `updated ${host.name} fail`);
    }
  };

  const handleClose = () => {
    setFormData({} as Host);
    onCloseModal();
  };

  const handleSubmit = async (host: Host) => {
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

export const BackupModal = (props: any) => {
  const { connUUID = "" } = useParams();
  const { isModalVisible, selectedHost, backups, fetchBackups, onCloseModal } =
    props;
  const [isSaveBackup, setIsSaveBackup] = useState(false);
  const [isRestoreBackup, setIsRestoreBackup] = useState(false);
  const [comment, setComment] = useState<any>();
  const [backup, setBackup] = useState<any>();

  const backupFactory = new BackupFactory();
  backupFactory.connectionUUID = connUUID;

  const navigateToNewTab = (host: Host) => {
    try {
      const { ip } = host;
      let source = `http://${ip}:1313/`;
      if (host.https) {
        source = `https://${ip}:1313/`;
      }
      OpenURL(source);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    }
  };

  const saveBackupHandle = async (host: Host) => {
    setIsSaveBackup(true);
    try {
      backupFactory.hostUUID = host.uuid;
      if (comment.length < 2) {
        openNotificationWithIcon("error", "please enter a comment");
        return;
      }
      await backupFactory.WiresBackup(comment as unknown as string);
      openNotificationWithIcon("success", `saved backup: ${host.name}`);
      fetchBackups();
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    } finally {
      setIsSaveBackup(false);
    }
  };

  const restoreBackupHandle = async (host: Host) => {
    setIsRestoreBackup(true);
    try {
      backupFactory.hostUUID = host.uuid;
      let uuid = backup as unknown as string;
      await backupFactory.WiresRestore(uuid);
      openNotificationWithIcon("success", `uploaded backup: ${host.name}`);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    } finally {
      setIsRestoreBackup(false);
    }
  };

  const onChange = (value: any) => {
    setBackup(value);
  };

  const onChangeComment = (value: any) => {
    setComment(value.target.value);
  };

  const handleClose = () => {
    setComment("");
    setBackup(null);
    onCloseModal();
  };

  return (
    <Modal
      centered
      title={selectedHost.name}
      visible={isModalVisible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}
      style={{ textAlign: "start" }}
    >
      <Card title="Rubix-Wires">
        <Row style={actionRow}>
          <Col span={10}>
            <Button
              type="primary"
              onClick={() => navigateToNewTab(selectedHost)}
              style={buttonStyle}
            >
              open Rubix-Wires
            </Button>
          </Col>
        </Row>
        <Row style={actionRow}>
          <Col span={10}>
            <Button
              type="primary"
              onClick={() => saveBackupHandle(selectedHost)}
              loading={isSaveBackup}
              style={buttonStyle}
            >
              save backup
            </Button>
          </Col>
          <Col span={14}>
            <Input
              placeholder="enter a comment"
              maxLength={150}
              onChange={onChangeComment}
              value={comment}
            />
          </Col>
        </Row>
        <Row style={actionRow}>
          <Col span={10}>
            <Button
              type="primary"
              onClick={() => restoreBackupHandle(selectedHost)}
              loading={isRestoreBackup}
              style={buttonStyle}
            >
              restore backup
            </Button>
          </Col>
          <Col span={14}>
            <Select
              showSearch
              placeholder="select a backup"
              style={{ width: "100%" }}
              optionFilterProp="children"
              value={backup}
              onChange={onChange}
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {backups.map((data: Backup) => (
                <Option key={data.uuid} value={data.uuid}>
                  {data.user_comment}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
