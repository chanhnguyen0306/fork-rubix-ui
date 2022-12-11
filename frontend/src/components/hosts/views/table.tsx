import { Space, Spin, Tooltip, Typography } from "antd";
import {
  ArrowRightOutlined,
  DownloadOutlined,
  FormOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { amodel, backend, storage } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../common/rb-table-actions";
import { HOST_HEADERS } from "../../../constants/headers";
import { ROUTES } from "../../../constants/routes";
import { isObjectEmpty } from "../../../utils/utils";
import { BackupFactory } from "../../backups/factory";
import { HostsFactory } from "../factory";
import { BackupModal, CreateEditModal } from "./modals";
import "./style.css";
import { TokenModal } from "../../../common/token/token-modal";
import { EdgeBiosTokenFactory } from "../../edgebios/token-factory";
import { InstallRubixEdgeModal } from "./install-rubix-edge/install-rubix-edge-modal";
import { InstallFactory } from "./install-rubix-edge/factory";
import { AppInstallInfo } from "./install-app-info";

import Host = amodel.Host;
import Location = amodel.Location;
import Backup = storage.Backup;
import UUIDs = backend.UUIDs;

const ExpandedRow = (props: any) => {
  return (
    <div>
      <AppInstallInfo {...props} />
    </div>
  );
};

export const HostsTable = (props: any) => {
  const { hosts, networks, isFetching, refreshList } = props;
  let { connUUID = "", netUUID = "", locUUID = "" } = useParams();
  const [backups, setBackups] = useState([] as Array<Backup>);
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [currentHost, setCurrentHost] = useState({} as Host);
  const [hostSchema, setHostSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isBackupModalVisible, setIsBackupModalVisible] = useState(false);
  const [isInstallRubixEdgeModalVisible, setIsInstallRubixEdgeModalVisible] =
    useState(false);
  const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);
  const [tokenFactory, setTokenFactory] = useState(
    new EdgeBiosTokenFactory(connUUID)
  );

  let backupFactory = new BackupFactory();
  let factory = new HostsFactory();
  let installFactory = new InstallFactory();
  factory.connectionUUID = connUUID;
  installFactory.connectionUUID = connUUID;

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
          <Tooltip title="Ping">
            <a
              onClick={(e) => {
                handlePing(host.uuid, e);
              }}
            >
              <LinkOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Edit">
            <a
              onClick={(e) => {
                showModal(host, e);
              }}
            >
              <FormOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Rubix-Wires and Backup">
            <a
              onClick={(e) => {
                showBackupModal(host, e);
              }}
            >
              <MenuFoldOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Install Rubix Edge">
            <a
              onClick={(e) => {
                showRubixEdgeInstallModal(host, e);
              }}
            >
              <DownloadOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Tokens">
            <a
              onClick={(e) => {
                showTokenModal(host, e);
              }}
            >
              <ScanOutlined />
            </a>
          </Tooltip>
          <Link
            to={ROUTES.HOST.replace(":connUUID", connUUID)
              .replace(":locUUID", locUUID)
              .replace(":netUUID", netUUID)
              .replace(":hostUUID", host.uuid)}
          >
            <Tooltip title="View Networks">
              <ArrowRightOutlined />
            </Tooltip>
          </Link>
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
    fetchBackups().catch(console.log);
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

  const handlePing = (uuid: string, e: any) => {
    e.stopPropagation();
    factory.uuid = uuid;
    factory.PingHost().catch(console.error);
  };

  const getNetworkNameByUUID = (uuid: string) => {
    const network = networks.find((l: Location) => l.uuid === uuid);
    return network ? network.name : "";
  };

  const showModal = (host: Host, e: any) => {
    e.stopPropagation();
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

  const showBackupModal = (host: Host, e: any) => {
    e.stopPropagation();
    setCurrentHost(host);
    setIsBackupModalVisible(true);
  };

  const showRubixEdgeInstallModal = (host: Host, e: any) => {
    e.stopPropagation();
    setCurrentHost(host);
    setIsInstallRubixEdgeModalVisible(true);
  };

  const onCloseRubixEdgeInstallModal = () => {
    setIsInstallRubixEdgeModalVisible(false);
  };

  const onCloseBackupModal = () => {
    setIsBackupModalVisible(false);
    setCurrentHost({} as Host);
  };

  const showTokenModal = (host: Host, e: any) => {
    e.stopPropagation();
    setCurrentHost(host);
    setIsTokenModalVisible(true);
  };

  const onCloseTokenModal = () => {
    setIsTokenModalVisible(false);
    setCurrentHost({} as Host);
  };

  useEffect(() => {
    const _tokenFactory: EdgeBiosTokenFactory = new EdgeBiosTokenFactory(
      connUUID
    );
    _tokenFactory.hostUUID = currentHost.uuid;
    setTokenFactory(_tokenFactory);
  }, [currentHost]);

  return (
    <div>
      <RbRefreshButton refreshList={refreshList} />
      <RbAddButton handleClick={(e: any) => showModal({} as Host, e)} />
      <RbDeleteButton bulkDelete={bulkDelete} />

      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
        expandable={{
          expandedRowRender: (host: any) => <ExpandedRow host={host} />,
          rowExpandable: (record: any) => record.name !== "Not Expandable",
        }}
        expandRowByClick
      />
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
      <BackupModal
        isModalVisible={isBackupModalVisible}
        selectedHost={currentHost}
        backups={backups}
        fetchBackups={fetchBackups}
        onCloseModal={onCloseBackupModal}
      />
      <InstallRubixEdgeModal
        isModalVisible={isInstallRubixEdgeModalVisible}
        onCloseModal={onCloseRubixEdgeInstallModal}
        installFactory={installFactory}
        host={currentHost}
      />
      <TokenModal
        isModalVisible={isTokenModalVisible}
        displayName={currentHost.name}
        onCloseModal={onCloseTokenModal}
        factory={tokenFactory}
      />
    </div>
  );
};
