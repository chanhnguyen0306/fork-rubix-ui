import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Spin, Image, PaginationProps, Select, Input } from "antd";
import {
  MenuFoldOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { DeleteHost } from "../../../../wailsjs/go/main/App";
import { assistmodel, storage } from "../../../../wailsjs/go/models";
import { BackupFactory } from "../../backups/factory";
import RbTable from "../../../common/rb-table";
import imageRC5 from "../../../assets/images/RC5.png";
import imageRCIO from "../../../assets/images/RC-IO.png";
import imageEdge28 from "../../../assets/images/Edge-iO-28.png";
import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;
import { SidePanel } from "./side-panel";

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
  let backupFactory = new BackupFactory();

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
        if (product == "Edge28") {
          image = imageEdge28;
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
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      let res = (await backupFactory.GetBackupsRubixWires()) || [];
      setBackups(res);
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
        backups={backups}
        fetchBackups={fetchBackups}
      />
    </div>
  );
};
