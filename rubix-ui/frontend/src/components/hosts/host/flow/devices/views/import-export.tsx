import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Modal, Select } from "antd";
import { FlowDeviceFactory } from "../factory";
import { BackupFactory } from "../../../../../backups/factory";
import { model, storage } from "../../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../../utils/utils";

import Point = model.Point;
import Backup = storage.Backup;

const { Option } = Select;

export const ExportModal = (props: any) => {
  const { isModalVisible, selectedItems, onClose } = props;
  const { connUUID = "", hostUUID = "", networkUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [comment, setComment] = useState<any>();

  let flowdeviceFactory = new FlowDeviceFactory();
  flowdeviceFactory.connectionUUID = connUUID;
  flowdeviceFactory.hostUUID = hostUUID;

  const handleOk = async () => {
    try {
      if (comment.length < 2) {
        openNotificationWithIcon("error", "please enter a comment");
        return;
      }
      setConfirmLoading(true);
      const uuids = selectedItems.map((p: Point) => p.uuid);
      await flowdeviceFactory.BulkExport(comment, networkUUID, uuids);
      openNotificationWithIcon("success", "export success");
      handleCloseModal();
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", error.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onChangeComment = (value: any) => {
    setComment(value.target.value);
  };

  const handleCloseModal = () => {
    setComment("");
    onClose();
  };

  return (
    <Modal
      title="Export"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCloseModal}
      confirmLoading={confirmLoading}
    >
      <Input
        value={comment}
        onChange={onChangeComment}
        placeholder="please enter a comment"
      />
    </Modal>
  );
};

export const ImportModal = (props: any) => {
  const { isModalVisible, onClose, refreshList } = props;
  const { connUUID = "", hostUUID = "", networkUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [backupUUID, setBackupUUID] = useState<any>();
  const [backups, setBackups] = useState([] as Backup[]);

  let backupFactory = new BackupFactory();
  const application = backupFactory.AppFlowFramework;
  const subApplication = backupFactory.SubFlowFrameworkDevice;
  let flowdeviceFactory = new FlowDeviceFactory();
  flowdeviceFactory.connectionUUID = backupFactory.connectionUUID = connUUID;
  flowdeviceFactory.hostUUID = backupFactory.hostUUID = hostUUID;

  useEffect(() => {
    if (isModalVisible) {
      fetchBackups();
    }
  }, [isModalVisible]);

  const fetchBackups = async () => {
    try {
      let res =
        (await backupFactory.GetBackupsByApplication(
          application,
          subApplication,
          true
        )) || [];
      setBackups(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await flowdeviceFactory.BulkImport(backupUUID, networkUUID);
      openNotificationWithIcon("success", `import success`);
      refreshList();
      handleClose();
    } catch (error: any) {
      console.log(error);
      openNotificationWithIcon("error", error.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onChange = async (uuid: string) => {
    setBackupUUID(uuid);
  };

  const handleClose = () => {
    setBackupUUID(null);
    onClose();
  };

  return (
    <Modal
      title="Import"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
    >
      <Select
        showSearch
        placeholder="select a backup"
        style={{ width: "100%" }}
        onChange={onChange}
        value={backupUUID}
      >
        {backups.map((data: Backup) => (
          <Option key={data.uuid} value={data.uuid}>
            {data.user_comment}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};
