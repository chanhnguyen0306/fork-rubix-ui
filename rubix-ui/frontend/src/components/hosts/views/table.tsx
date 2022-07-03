import { useState } from "react";
import { Menu, MenuProps, Space, Spin, Table } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { DeleteHost, OpenURL } from "../../../../wailsjs/go/main/App";
import { openNotificationWithIcon } from "../../../utils/utils";
import { assistmodel } from "../../../../wailsjs/go/models";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

export const SidePanel = (props: any) => {
  const { collapsed } = props;

  function getItem(label: React.ReactNode, key: React.Key): MenuItem {
    return {
      key,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Option 1", "1"),
    getItem("Option 2", "2"),
    getItem("Option 3", "3"),
  ];

  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      items={items}
    />
  );
};

export const HostsTable = (props: any) => {
  const { hosts, networks, showModal, isFetching, connUUID, refreshList } =
    props;
  const [collapsed, setCollapsed] = useState(true);

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
            View
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
          {/* <a
            onClick={() => {
              navigateToNewTab(host);
            }}
          >
            Rubix-Wires
          </a> */}
          <a onClick={() => setCollapsed(!collapsed)}>
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

  const navigateToNewTab = (host: assistmodel.Host) => {
    try {
      const { ip } = host;
      const source = `http://${ip}:1313/`;
      OpenURL(source);
    } catch (err: any) {
      openNotificationWithIcon("error", err.message);
    }
  };

  return (
    <div className="aaaa">
      <Table
        rowKey="uuid"
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <SidePanel collapsed={collapsed} />
    </div>
  );
};
