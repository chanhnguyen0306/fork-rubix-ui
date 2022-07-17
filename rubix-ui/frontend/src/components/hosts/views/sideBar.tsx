import { Button, Card, Col, Input, Menu, MenuProps, Row, Select } from "antd";
import { useState } from "react";
import { BackupFactory } from "../../backups/factory";
import { OpenURL } from "../../../../wailsjs/go/main/App";
import { openNotificationWithIcon } from "../../../utils/utils";
import { assistmodel, storage } from "../../../../wailsjs/go/models";
import Host = assistmodel.Host;

const actionRow: React.CSSProperties = { margin: "8px 0" };
const buttonStyle: React.CSSProperties = { width: "90%" };

export const SidePanel = (props: any) => {
  const {
    collapsed,
    selectedHost,
    connUUID,
    sidePanelHeight,
    backups,
    fetchBackups,
  } = props;
  const [isSaveBackup, setIsSaveBackup] = useState(false);
  const [isRestoreBackup, setIsRestoreBackup] = useState(false);
  const [comment, setComment] = useState<any>();
  const [backup, setBackup] = useState();
  let backupFactory = new BackupFactory();

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
      backupFactory.connectionUUID = connUUID;
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
      backupFactory.connectionUUID = connUUID;
      backupFactory.hostUUID = host.uuid;
      backupFactory.uuid = backup as unknown as string;
      await backupFactory.WiresRestore();
      openNotificationWithIcon("success", `uploaded backup: ${host.name}`);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    } finally {
      setIsRestoreBackup(false);
    }
  };
  const { Option } = Select;

  const onChange = (value: any) => {
    setBackup(value);
  };

  const onChangeComment = (value: any) => {
    setComment(value.target.value);
  };

  return (
    <Menu
      mode="inline"
      inlineCollapsed={collapsed}
      style={{
        height: sidePanelHeight + "px",
        width: "600px",
        textAlign: "start",
      }}
    >
      <h4 style={{ margin: "10px" }}>{selectedHost.name}</h4>
      <Card
        title="Rubix-Wires"
        style={{ display: collapsed ? "none" : "block" }}
      >
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
              onChange={onChange}
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {backups.map((data: storage.Backup) => (
                <Option key={data.uuid} value={data.uuid}>
                  {data.user_comment}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
    </Menu>
  );
};
