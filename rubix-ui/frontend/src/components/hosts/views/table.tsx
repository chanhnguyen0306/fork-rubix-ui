import { Space, PaginationProps, Spin } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { assistmodel, storage, main } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import {
  RbDeleteButton,
  RbAddButton,
  RbRefreshButton,
} from "../../../common/rb-table-actions";
import { HOST_HEADERS } from "../../../constants/headers";
import { ROUTES } from "../../../constants/routes";
import { useDialogs } from "../../../hooks/useDialogs";
import { isObjectEmpty } from "../../../utils/utils";
import { BackupFactory } from "../../backups/factory";
import { HostsFactory } from "../factory";
import { CreateEditModal } from "./create";
import InstallApp from "./installApp";
import { SidePanel } from "./side-panel";
import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;

const INSTALL_DIALOG = "INSTALL_DIALOG";

export const HostsTable = (props: any) => {
  const { hosts, networks, isFetching, refreshList } = props;
  let { connUUID = "", netUUID = "", locUUID = "" } = useParams();

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
  const { closeDialog, isOpen, openDialog, dialogData } = useDialogs([
    INSTALL_DIALOG,
  ]);

  let backupFactory = new BackupFactory();
  let factory = new HostsFactory();
  factory.connectionUUID = connUUID as string;

  const columns = [
    ...HOST_HEADERS,
    {
      title: "network",
      dataIndex: "network_uuid",
      key: "network_uuid",
      render: (network_uuid: string) => (
        <span>{getNetworkNameByUUID(network_uuid)}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, host: Host) => (
        <Space size="middle">
          <Link
            to={ROUTES.HOST.replace(":connUUID", connUUID)
              .replace(":locUUID", locUUID)
              .replace(":netUUID", netUUID)
              .replace(":hostUUID", host.uuid)}
          >
            View Networks
          </Link>
          <a
            onClick={() => {
              showModal(host);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              openDialog(INSTALL_DIALOG, { state: host });
            }}
          >
            Install
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
    const jsonSchema = {
      properties: res,
    };
    setHostSchema(jsonSchema);
    setIsLoadingForm(false);
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
        <RbAddButton handleClick={() => showModal({} as assistmodel.Host)} />
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
      <InstallApp
        isOpen={isOpen(INSTALL_DIALOG)}
        closeDialog={() => closeDialog(INSTALL_DIALOG)}
        dialogData={dialogData[INSTALL_DIALOG]}
      />
    </div>
  );
};
