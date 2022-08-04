import { Button, Card, Col, Input, Row, Select } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { assistmodel, model } from "../../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../../utils/utils";
import { BackupFactory } from "../../../../../backups/factory";
import { FlowNetworkFactory } from "../factory";

import Host = assistmodel.Host;
import Network = model.Network;

const actionRow: React.CSSProperties = { margin: "8px 0" };
const buttonStyle: React.CSSProperties = { width: "90%" };
const { Option } = Select;

export const SidePanel = (props: any) => {
  const { collapsed, selectedItem, sidePanelHeight } = props;
  const { connUUID = "", hostUUID = "" } = useParams();
  const [isSaveBackup, setIsSaveBackup] = useState(false);
  const [isRestoreBackup, setIsRestoreBackup] = useState(false);
  const [backup, setBackup] = useState();
  const [comment, setComment] = useState<any>();

  let backupFactory = new BackupFactory();
  const application = backupFactory.AppFlowFramework;
  const subApplication = backupFactory.SubFlowFrameworkNetwork;
  let flowNetworkFactory = new FlowNetworkFactory();
  flowNetworkFactory.connectionUUID = backupFactory.connectionUUID = connUUID;
  flowNetworkFactory.hostUUID = backupFactory.hostUUID = hostUUID;

  const saveBackupHandle = async () => {
    setIsSaveBackup(true);
    try {
      if (comment.length < 2) {
        return openNotificationWithIcon("error", "please enter a comment");
      }
      const network = await flowNetworkFactory.GetOne(selectedItem.uuid, true);
      await backupFactory.DoBackup(
        application,
        subApplication,
        comment,
        network as any
      );
    } catch (err: any) {
      console.log(err);
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
        style={{
          display: collapsed ? "none" : "block",
        }}
      >
        <Card title={selectedItem.name}>
          <Row style={actionRow}>
            <Col span={10}>
              <Button
                type="primary"
                onClick={saveBackupHandle}
                loading={isSaveBackup}
                style={buttonStyle}
              >
                save backup
              </Button>
            </Col>
            <Col span={14}>
              <Input
                placeholder="enter a comment..."
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
