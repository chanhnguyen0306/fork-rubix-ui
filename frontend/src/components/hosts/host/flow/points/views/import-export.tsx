import { Input, Modal, Select, UploadProps, message, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FlowPointFactory } from "../factory";
import { BackupFactory } from "../../../../../backups/factory";
import { model, storage } from "../../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../../utils/utils";
import * as xlsx from "xlsx";

import Point = model.Point;
import Backup = storage.Backup;
import {
  createColumns,
  MassEditTable,
} from "../../../../../../common/mass-edit-table";

const { Dragger } = Upload;
const { Option } = Select;

export const ExportModal = (props: any) => {
  const { isModalVisible, selectedItems, onClose } = props;
  const { connUUID = "", hostUUID = "", deviceUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [comment, setComment] = useState<any>();

  let flowPointFactory = new FlowPointFactory();
  flowPointFactory.connectionUUID = connUUID;
  flowPointFactory.hostUUID = hostUUID;

  const handleOk = async () => {
    try {
      if (comment.length < 2) {
        openNotificationWithIcon("error", "please enter a comment");
        return;
      }
      setConfirmLoading(true);
      const uuids = selectedItems.map((p: Point) => p.uuid);
      await flowPointFactory.BulkExport(comment, deviceUUID, uuids);
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

export const ImportJsonModal = (props: any) => {
  const { isModalVisible, onClose, refreshList } = props;
  const { connUUID = "", hostUUID = "", deviceUUID = "" } = useParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [backupUUID, setBackupUUID] = useState<any>();
  const [backups, setBackups] = useState([] as Backup[]);

  let backupFactory = new BackupFactory();
  const application = backupFactory.AppFlowFramework;
  const subApplication = backupFactory.SubFlowFrameworkPoint;
  let flowPointFactory = new FlowPointFactory();
  flowPointFactory.connectionUUID = backupFactory.connectionUUID = connUUID;
  flowPointFactory.hostUUID = backupFactory.hostUUID = hostUUID;

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
      await flowPointFactory.BulkImport(backupUUID, deviceUUID);
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

export const ImportExcelModal = (props: any) => {
  const { deviceUUID = "" } = useParams();
  const { isModalVisible, onClose, refreshList, schema } = props;
  const [file, setFile] = useState<UploadFile | undefined>(undefined);
  const [items, setItems] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[] | undefined>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setFile(info.file);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const convertExcelToJson = (file: UploadFile | any) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file.originFileObj);
    fileReader.onload = (event: any) => {
      let data = event.target.result;
      let workbook = xlsx.read(data, { type: "binary" });
      const rowObject = xlsx.utils
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        .map((row: any) => {
          for (let key in row) {
            const newKey = key.trimEnd();
            const value = row[key];
            delete row[key];
            row = { ...row, [newKey]: value };
          }
          return row;
        });
      setItems(rowObject);
    };
  };

  const handleOk = async () => {
    convertExcelToJson(file);
  };

  const handleClose = () => {
    setFile(undefined);
    onClose();
  };

  useEffect(() => {
    if (isModalVisible && (!columns || columns.length === 0)) {
      setColumns(createColumns(schema.properties));
    }
  }, [isModalVisible]);

  return (
    <Modal
      title="Import"
      visible={isModalVisible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleClose}
      className="text-start"
    >
      <Dragger
        {...uploadProps}
        customRequest={dummyRequest}
        maxCount={1}
        accept=".xlsx, .xls"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single upload</p>
      </Dragger>
      {items && items.length !== 0 && columns && columns.length !== 0 && (
        <MassEditTable
          parentPropId={{ key: "device_uuid", value: deviceUUID }}
          columns={columns}
          items={items}
          setItems={setItems}
        />
      )}
    </Modal>
  );
};
