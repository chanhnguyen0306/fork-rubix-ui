import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Spin, Image, PaginationProps } from "antd";
import {
  MenuFoldOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { assistmodel, main, storage } from "../../../../wailsjs/go/models";
import { isObjectEmpty } from "../../../utils/utils";
import { HostsFactory } from "../factory";
import { BackupFactory } from "../../backups/factory";
import RbTable from "../../../common/rb-table";
import { CreateEditModal } from "./create";
import { SidePanel } from "./side-panel";
import imageRC5 from "../../../assets/images/RC5.png";
import imageRCIO from "../../../assets/images/RC-IO.png";
import imageEdge28 from "../../../assets/images/Edge-iO-28.png";
import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../common/rb-table-actions";

export const HostsTable = (props: any) => {
  const { hosts, networks, isFetching, connUUID, netUUID, refreshList } = props;
  const [collapsed, setCollapsed] = useState(true);
  const [selectedHost, setSelectedHost] = useState({} as Host);
  const [sidePanelHeight, setSidePanelHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [backups, setBackups] = useState([] as Array<storage.Backup>);
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  const [currentHost, setCurrentHost] = useState({} as assistmodel.Host);
  const [hostSchema, setHostSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const navigate = useNavigate();
  let backupFactory = new BackupFactory();
  let factory = new HostsFactory();
  factory.connectionUUID = connUUID as string;

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

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await factory.Schema();
    res.properties = {
      ...res.properties,
      network_uuid: {
        title: "network",
        type: "string",
        anyOf: networks.map((n: assistmodel.Network) => {
          return { type: "string", enum: [n.uuid], title: n.name };
        }),
        default: netUUID,
      },
    };
    setHostSchema(res);
    setIsLoadingForm(false);
  };

  const deleteHost = async (uuid: string) => {
    factory.uuid = uuid;
    await factory.Delete();
    refreshList();
  };

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
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

  const showModal = (host: assistmodel.Host) => {
    setCurrentHost(host);
    setIsModalVisible(true);
    if (isObjectEmpty(hostSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentHost({} as assistmodel.Host);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  return (
    <div>
      <div className="hosts-table-actions">
        <RbDeleteButton bulkDelete={bulkDelete} />
        <RbAddButton showModal={() => showModal({} as assistmodel.Host)} />
        <RbRefreshButton refreshList={refreshList} />
      </div>
      <div className="hosts-table">
        <RbTable
          rowKey="uuid"
          rowSelection={rowSelection}
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
      <CreateEditModal
        hosts={hosts}
        currentHost={currentHost}
        hostSchema={hostSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        connUUID={connUUID}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
      />
    </div>
  );
};
