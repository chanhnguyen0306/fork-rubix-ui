import { Space, Spin, Tooltip } from "antd";
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
import { BackupModal, CreateEditModal } from "./modals";
import InstallApp from "./installApp";
import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;
import Backup = storage.Backup;
import UUIDs = main.UUIDs;

const INSTALL_DIALOG = "INSTALL_DIALOG";

export const HostsTable = (props: any) => {
  const { hosts, networks, isFetching, refreshList } = props;
  const { connUUID = "", netUUID = "", locUUID = "" } = useParams();
  const { closeDialog, isOpen, openDialog, dialogData } = useDialogs([
    INSTALL_DIALOG,
  ]);
  const [backups, setBackups] = useState([] as Array<Backup>);
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [currentHost, setCurrentHost] = useState({} as Host);
  const [hostSchema, setHostSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isBackupModalVisible, setIsBackupModalVisible] = useState(false);

  let backupFactory = new BackupFactory();
  let factory = new HostsFactory();
  factory.connectionUUID = connUUID;

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

          <Tooltip title="Rubix-Wires and Backup">
            <a onClick={() => showBackupModal(host)}>
              <MenuFoldOutlined />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    let res = (await backupFactory.GetBackupsRubixWires()) || [];
    setBackups(res);
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

  const showModal = (host: Host) => {
    setCurrentHost(host);
    setIsModalVisible(true);
    if (isObjectEmpty(hostSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentHost({} as Host);
  };

  const showBackupModal = (host: Host) => {
    setCurrentHost(host);
    setIsBackupModalVisible(true);
  };

  const onCloseBackupModal = () => {
    setIsBackupModalVisible(false);
    setCurrentHost({} as Host);
  };

  return (
    <div>
      <div className="hosts-table-actions">
        <RbDeleteButton bulkDelete={bulkDelete} />
        <RbAddButton handleClick={() => showModal({} as Host)} />
        <RbRefreshButton refreshList={refreshList} />
      </div>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        hosts={hosts}
        currentHost={currentHost}
        hostSchema={hostSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
      />
      <InstallApp
        isOpen={isOpen(INSTALL_DIALOG)}
        closeDialog={() => closeDialog(INSTALL_DIALOG)}
        dialogData={dialogData[INSTALL_DIALOG]}
      />
      <BackupModal
        isModalVisible={isBackupModalVisible}
        selectedHost={currentHost}
        backups={backups}
        fetchBackups={fetchBackups}
        onCloseModal={onCloseBackupModal}
      />
    </div>
  );
};
