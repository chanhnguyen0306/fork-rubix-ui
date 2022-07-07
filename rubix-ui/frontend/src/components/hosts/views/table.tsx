import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuProps, Space, Spin, Table } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { BackupFactory } from "../../backups/factory";
import { DeleteHost, OpenURL } from "../../../../wailsjs/go/main/App";
import { assistmodel } from "../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../utils/utils";
import "./style.css";

import Host = assistmodel.Host;

type MenuItem = Required<MenuProps>["items"][number];

export const SidePanel = (props: any) => {
  const { collapsed, selectedHost, connUUID, sidePanelHeight } = props;
  const [isSaveBackup, setIsSaveBackup] = useState(false);
  const [isRestorebackup, setIsRestorebackup] = useState(false);

  let backupFactory = new BackupFactory();

  const getItem = (label: React.ReactNode, key: React.Key): MenuItem => {
    return {
      key,
      label,
    } as MenuItem;
  };

  const navigateToNewTab = (host: Host) => {
    try {
      const { ip } = host;
      const source = `http://${ip}:1313/`;
      OpenURL(source);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    }
  };

  const saveBackupHanlde = async (host: Host) => {
    setIsSaveBackup(true);
    try {
      backupFactory.connectionUUID = connUUID;
      backupFactory.hostUUID = host.uuid;
      backupFactory.uuid = host.uuid;
      const res = await backupFactory.WiresBackup();
      console.log("saveBackupHanlde", res);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    } finally {
      setIsSaveBackup(false);
    }
  };

  const restoreBackupHanlde = async (host: Host) => {
    setIsRestorebackup(true);

    try {
      backupFactory.connectionUUID = connUUID;
      backupFactory.hostUUID = host.uuid;
      backupFactory.uuid = host.uuid;
      const res = await backupFactory.WiresRestore();
      console.log("restoreBackupHanlde", res);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    } finally {
      setIsRestorebackup(false);
    }
  };

  const items: MenuItem[] = [
    getItem(
      <Button type="text" onClick={() => navigateToNewTab(selectedHost)}>
        open Rubix-Wires
      </Button>,
      "1"
    ),
    getItem(
      <Button
        type="text"
        onClick={() => saveBackupHanlde(selectedHost)}
        loading={isSaveBackup}
      >
        save backup
      </Button>,
      "2"
    ),
    getItem(
      <Button
        type="text"
        onClick={() => restoreBackupHanlde(selectedHost)}
        loading={isRestorebackup}
      >
        restore backup
      </Button>,
      "3"
    ),
  ];

  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
      style={{ height: sidePanelHeight + "px" }}
    />
  );
};

export const HostsTable = (props: any) => {
  const { hosts, networks, showModal, isFetching, connUUID, refreshList } =
    props;
  const [collapsed, setCollapsed] = useState(true);
  const [selectedHost, setSelectedHost] = useState({} as Host);
  const [sidePanelHeight, setSidePanelHeight] = useState(0);

  useEffect(() => {
    console.log(11111);

    const height = (hosts.length + 1) * 55;
    setSidePanelHeight(height);
  }, [hosts.length]);

  if (!hosts) return <></>;
  const navigate = useNavigate();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Network",
      dataIndex: "network_uuid",
      key: "network_uuid",
      render: (network_uuid: string) => (
        <span>{getNetworkNameByUUID(network_uuid)}</span>
      ),
    },
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, host: assistmodel.Host) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/host/${host.uuid}`, {
                state: { connUUID: connUUID, hostUUID: host.uuid },
              })
            }
          >
            View-Device
          </a>
          <a
            onClick={() => {
              showModal(host);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              deleteHost(host.uuid);
            }}
          >
            Delete
          </a>
          <a
            onClick={() => {
              setSelectedHost(host), setCollapsed(!collapsed);
            }}
          >
            <MenuFoldOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const deleteHost = async (uuid: string) => {
    await DeleteHost(connUUID, uuid);
    refreshList();
  };

  const getNetworkNameByUUID = (uuid: string) => {
    const network = networks.find((l: assistmodel.Location) => l.uuid === uuid);
    return network ? network.name : "";
  };
  const collapsedStyle = () => {
    if (collapsed) {
      return "opacity: 0.5, height: 100%";
    } else {
      return "width: '-webkit-fill-available'";
    }
  };

  return (
    <div className="hosts-table">
      <Table
        rowKey="uuid"
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
        className={collapsed ? "full-width" : "uncollapsed-style"}
      />
      <SidePanel
        collapsed={collapsed}
        selectedHost={selectedHost}
        connUUID={connUUID}
        sidePanelHeight={sidePanelHeight}
      />
    </div>
  );
};
