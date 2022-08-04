import { Button, Card, Col, Input, Menu, MenuProps, Row, Select } from "antd";
import { useState } from "react";
import { OpenURL } from "../../../../../../../wailsjs/go/main/App";
import { assistmodel, storage } from "../../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../../utils/utils";
import { BackupFactory } from "../../../../../backups/factory";

import Host = assistmodel.Host;

const actionRow: React.CSSProperties = { margin: "8px 0" };
const buttonStyle: React.CSSProperties = { width: "90%" };

export const SidePanel = (props: any) => {
  const { collapsed, selectedItem, connUUID, sidePanelHeight } = props;
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
      let uuid = backup as unknown as string;
      await backupFactory.WiresRestore(uuid);
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
    <div
      className={collapsed ? "ant-menu ant-menu-inline-collapsed" : "ant-menu "}
      style={{
        height: sidePanelHeight + "px",
        width: "600px",
        textAlign: "start",
      }}
    >
      <div
        className="content"
        style={{
          display: collapsed ? "none" : "block",
        }}
      >
        <Card title={selectedItem.name} className="rubix-wires-card">
          <Row style={actionRow}>
            <Col span={10}>
              <Button
                type="primary"
                onClick={() => saveBackupHandle(selectedItem)}
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
                onClick={() => restoreBackupHandle(selectedItem)}
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
              ></Select>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};
