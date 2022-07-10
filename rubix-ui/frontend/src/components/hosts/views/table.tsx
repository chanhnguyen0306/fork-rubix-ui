import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal} from "react";
import {useNavigate} from "react-router-dom";
import {
  Button,
  Menu,
  MenuProps,
  Space,
  Spin,
  Image,
  PaginationProps, Select, Input,
} from "antd";
import {
  MenuFoldOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {DeleteHost, OpenURL} from "../../../../wailsjs/go/main/App";
import {assistmodel, model, storage} from "../../../../wailsjs/go/models";
import {openNotificationWithIcon} from "../../../utils/utils";
import {BackupFactory} from "../../backups/factory";
import RbTable from "../../../common/rb-table";
import imageRC5 from "../../../assets/images/RC5.png";
import imageRCIO from "../../../assets/images/RC-IO.png";
import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;

type MenuItem = Required<MenuProps>["items"][number];

export const SidePanel = (props: any) => {
  const {collapsed, selectedHost, connUUID, sidePanelHeight, fetchBackups} = props;
  const [isSaveBackup, setIsSaveBackup] = useState(false);
  const [isRestoreBackup, setIsRestoreBackup] = useState(false);
  const [comment, setComment] = useState();
  const [backup, setBackup] = useState();
  let backupFactory = new BackupFactory();

  const getItem = (label: React.ReactNode, key: React.Key): MenuItem => {
    return {
      key,
      label,
    } as MenuItem;
  };

  const navigateToNewTab = (host: Host) => {
    try {
      const {ip} = host;
      const source = `http://${ip}:1313/`;
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

      await backupFactory.WiresBackup(comment as unknown as string);
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
  const {Option} = Select;

  const onChange = (value: any) => {
    setBackup(value)
  };

  const onChangeComment = (value:any) => {
    setComment(value.target.value)
  };

  const items: MenuItem[] = [
    getItem(
        <Button type="primary" onClick={() => navigateToNewTab(selectedHost)}>
          open Rubix-Wires
        </Button>,
        "1"
    ),
    getItem(
        <Input.Group compact>
          <Button
              type="primary"
              onClick={() => saveBackupHandle(selectedHost)}
              loading={isSaveBackup}
          >
            save backup
          </Button>,
          <Input
              style={{width: "250px", margin: "5px", float: "right"}}
              placeholder="enter a comment" maxLength={150}
              onChange={onChangeComment}
              value={comment}
          />

        </Input.Group>,
        "2"
    ),
    getItem(
        <>
          <Select
              showSearch
              placeholder="select a backup"
              style={{width: "250px", margin: "5px", float: "right"}}
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
          >
            {fetchBackups.map((data: storage.Backup) => <Option key={data.uuid} value={data.uuid}>{data.user_comment}</Option>)}
          </Select>
          <Button
              type="primary"
              onClick={() => restoreBackupHandle(selectedHost)}
              loading={isRestoreBackup}
          >
            restore backup
          </Button>,
        </>,

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
      style={{ height: sidePanelHeight + "px", width: "600px",  margin: "1px" }}
    />
  );
};

export const HostsTable = (props: any) => {
  const { hosts, networks, showModal, isFetching, connUUID, refreshList } =
    props;
  const [collapsed, setCollapsed] = useState(true);
  const [selectedHost, setSelectedHost] = useState({} as Host);
  const [sidePanelHeight, setSidePanelHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();
  const [backups, setBackups] = useState([] as Array<storage.Backup>);
  let backupFactory = new BackupFactory()


  const columns = [
    {
      title: "product",
      key: "product_type",
      dataIndex: "product_type",
      render(product: string) {
        let image = imageRC5;
        if (product == "RubixCompute") {
          image = imageRC5;
        }
        if (product == "RubixComputeIO") {
          image = imageRCIO;
        }
        return <Image width={70} src={image} />;
      },
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "product",
      key: "product_type",
      dataIndex: "product_type",
      render(product: string) {
        let icon = <PlayCircleOutlined />;
        if (product == "RubixCompute") {
          icon = <BookOutlined />;
        }
        if (product == "RubixComputeIO") {
        }
        return (
          //BookOutlined
          icon
        );
      },
    },
    {
      title: "network",
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
      render: (_: any, host: Host) => (
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

  useEffect(() => {
    setCollapsed(true);
    const totalPage = Math.ceil(hosts.length / 10);
    setTotalPage(totalPage);
    sidePanelHeightHandle();
  }, [hosts.length]);

  useEffect(() => {
    setCollapsed(true);
    sidePanelHeightHandle();
  }, [currentPage]);

  useEffect(() => {
    fetchBackups()
  }, []);


  const fetchBackups = async () => {
    try {
      let res = (await backupFactory.GetBackupsRubixWires()) || [];
      setBackups(res)
    } catch (error) {
      console.log(error);
    } finally {
    }
  };


  const deleteHost = async (uuid: string) => {
    await DeleteHost(connUUID, uuid);
    refreshList();
  };

  const getNetworkNameByUUID = (uuid: string) => {
    const network = networks.find((l: Location) => l.uuid === uuid);
    return network ? network.name : "";
  };

  const onChange: PaginationProps["onChange"] = ({ current }: any) => {
    setCurrentPage(current);
  };

  const sidePanelHeightHandle = () => {
    if (currentPage === totalPage) {
      const height = (hosts.length % 10) * 103 + 55; //get height of last page
      setSidePanelHeight(height);
    } else {
      const height =
        hosts.length >= 10 ? 10 * 103 + 55 : (hosts.length % 10) * 103 + 55;
      setSidePanelHeight(height);
    }
  };

  return (
    <div className="hosts-table">
      <RbTable
        rowKey="uuid"
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
        className={collapsed ? "full-width" : "uncollapsed-style"}
        onChange={onChange}
      />
      <SidePanel
        collapsed={collapsed}
        selectedHost={selectedHost}
        connUUID={connUUID}
        sidePanelHeight={sidePanelHeight}
        fetchBackups={backups}
      />
    </div>
  );
};
