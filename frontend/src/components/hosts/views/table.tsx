import {
  Button,
  Card,
  Dropdown,
  List,
  Menu,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  CloudDownloadOutlined,
  DownCircleOutlined,
  DownloadOutlined,
  FormOutlined,
  LeftOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  ScanOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { amodel, backend, storage } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import RbTag from "../../../common/rb-tag";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../common/rb-table-actions";
import { HOST_HEADERS } from "../../../constants/headers";
import { ROUTES } from "../../../constants/routes";
import { useDialogs } from "../../../hooks/useDialogs";
import { isObjectEmpty } from "../../../utils/utils";
import { BackupFactory } from "../../backups/factory";
import { ReleasesFactory } from "../../release/factory";
import { HostsFactory } from "../factory";
import InstallApp from "./installApp";
import { BackupModal, CreateEditModal } from "./modals";
import RbConfirmPopover from "../../../common/rb-confirm-popover";
import { tagMessageStateResolver } from "./utils";
import { REFRESH_TIMEOUT } from "./constants";
import "./style.css";
import UpdateApp from "./updateApp";
import { TokenModal } from "../../../common/token/token-modal";
import { EdgeBiosTokenFactory } from "../../edgebios/token-factory";
import {
  InstallRubixEdgeModal
} from "./install-rubix-edge/install-rubix-edge-modal";
import { InstallFactory } from "./install-rubix-edge/factory";
import Host = amodel.Host;
import Location = amodel.Location;
import Backup = storage.Backup;
import UUIDs = backend.UUIDs;

const { Text, Title } = Typography;
const releaseFactory = new ReleasesFactory();

const INSTALL_DIALOG = "INSTALL_DIALOG";
const UPDATE_DIALOG = "UPDATE_DIALOG";


interface InstalledAppI {
  active_state: string;
  app_name: string;
  is_installed: boolean;
  latest_version: string;
  match: boolean;
  message: string;
  service_name: string;
  state: string;
  sub_state: string;
  version: string;
}

interface AvailableAppI {
  app_name: string;
  latest_version: string;
}

const ExpandedRow = (props: any) => {
  return (
    <div>
      <AppInstallInfo {...props} />
    </div>
  );
};

const ConfirmActionMenu = (props: any) => {
  const { item, onMenuClick } = props;
  const [selectedAction, updateSelectedAction] = useState("" as string);
  const [isOpenConfirm, updateIsOpenConfirm] = useState(false);

  const handleOnMenuClick = (v: any) => {
    updateSelectedAction(v);
    updateIsOpenConfirm(true);
  };

  return (
    <div>
      {!isOpenConfirm ? (
        <Menu
          key={1}
          onClick={(v) => handleOnMenuClick(v)}
          items={[
            {
              key: "start",
              label: "Start",
            },
            {
              key: "restart",
              label: "Restart",
            },
            {
              key: "stop",
              label: "Stop",
            },
            {
              key: "uninstall",
              label: "Uninstall",
            },
          ]}
        />
      ) : (
        <Card>
          <div style={{ paddingBottom: 16 }}>
            <Button
              style={{ marginRight: "8px" }}
              shape="circle"
              icon={<LeftOutlined />}
              size="small"
              onClick={() => updateIsOpenConfirm(false)}
            />
            <strong>Are you sure?</strong>
          </div>
          <div>
            <Button
              onClick={() => {
                updateIsOpenConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="nube-primary white--text"
              onClick={() => onMenuClick(selectedAction, item)}
            >
              OK
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

const AppInstallInfo = (props: any) => {
  let timeout;
  const [isLoading, updateIsLoading] = useState(false);
  const [isActionLoading, updateActionLoading] = useState({} as any);
  const [isUpdating, updateIsUpdating] = useState(false);
  const [installedApps, updateInstalledApps] = useState([] as InstalledAppI[]);
  const [availableApps, updateAvailableApps] = useState([] as AvailableAppI[]);
  const [appInfoMsg, updateAppInfoMsg] = useState("");
  const { host } = props;
  const { connUUID = "" } = useParams();
  const { closeDialog, isOpen, openDialog, dialogData } = useDialogs([
    UPDATE_DIALOG,
  ]);

  useEffect(() => {
    fetchAppInfo().catch(console.error);
    return () => {
      timeout = null;
    };
  }, []);

  const installApp = (item: any) => {
    const payload = {
      connUUID: connUUID,
      hostUUID: host.uuid,
      appName: item.app_name,
      appVersion: item.latest_version,
    };
    releaseFactory
      .EdgeInstallApp(
        payload.connUUID,
        payload.hostUUID,
        payload.appName,
        payload.appVersion,
      )
      .catch((err) => ({ payload, hasError: true, err: err }));
  };

  const fetchAppInfo = () => {
    updateAppInfoMsg("");
    updateIsLoading(true);
    return releaseFactory
      .EdgeDeviceInfoAndApps(connUUID, host.uuid)
      .then((appInfo: any) => {
        if (!appInfo) {
          return updateAppInfoMsg("Apps are not downloaded yet.");
        }
        if (appInfo.installed_apps) {
          updateInstalledApps(appInfo.installed_apps);
        }
        if (appInfo.apps_available_for_install) {
          updateAvailableApps(appInfo.apps_available_for_install);
        }
      })
      .catch(() => {
        return updateAppInfoMsg("Error to fetch edge device info and apps");
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  if (appInfoMsg) {
    return (
      <span>
        {appInfoMsg}
        <span>
          {" "}
          <a onClick={() => fetchAppInfo()}>Click here to refresh</a>
        </span>
      </span>
    );
  }

  const onMenuClick = (value: any, item: any) => {
    updateActionLoading((prevState: any) => ({
      ...prevState,
      [item.app_name]: true,
    }));
    return releaseFactory
      .EdgeServiceAction(value.key, {
        connUUID: connUUID,
        hostUUID: host.uuid,
        appName: item.app_name,
      })
      .then(() => {
        timeout = setTimeout(() => {
          fetchAppInfo().catch(console.log);
        }, REFRESH_TIMEOUT);
      })
      .finally(() => {
        updateActionLoading((prevState: any) => ({
          ...prevState,
          [item.app_name]: false,
        }));
      });
  };

  const openUpdateApp = () => {
    openDialog(UPDATE_DIALOG, { host: host, connUUID });
  };

  return (
    <div>
      <UpdateApp
        isOpen={isOpen(UPDATE_DIALOG)}
        isLoading={isLoading}
        dialogData={dialogData[UPDATE_DIALOG]}
        closeDialog={() => closeDialog(UPDATE_DIALOG)}
        handleUpdate={() => fetchAppInfo()}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid #dfdfdf",
        }}
      >
        <Title level={5}>App details</Title>

        <Button
          className="restart-color white--text"
          onClick={openUpdateApp}
          loading={isUpdating}
          style={{ margin: "0 6px 10px 0", float: "left", marginLeft: 10 }}
        >
          <DownCircleOutlined /> Update
        </Button>

        <RbRefreshButton
          style={{ marginLeft: 10 }}
          refreshList={() => fetchAppInfo()}
        />
      </div>

      <List
        itemLayout="horizontal"
        loading={isLoading}
        dataSource={availableApps}
        header={<strong>Available Apps</strong>}
        renderItem={(item) => (
          <List.Item style={{ padding: "0 16px" }}>
            <List.Item.Meta
              title={<span>{item.app_name}</span>}
              description={item.latest_version}
            />
            <RbConfirmPopover
              title="Install App"
              buttonTitle="Install"
              handleOk={() => installApp(item)}
            />
          </List.Item>
        )}
      />

      <List
        itemLayout="horizontal"
        loading={isLoading}
        dataSource={installedApps}
        header={<strong>Installed Apps</strong>}
        renderItem={(item) => (
          <List.Item style={{ padding: "8px 16px" }}>
            <List.Item.Meta
              title={<span>{item.app_name}</span>}
              description={item.message}
            />
            <span
              className="flex-1"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderLeft: "1px solid #dfdfdf",
                padding: "0 2rem",
              }}
            >
              <span>
                <RbTag state={item.state} />
                <RbTag state={item.sub_state} />
                <RbTag state={item.active_state} />
              </span>

              <Text style={{ paddingTop: 5 }} type="secondary" italic>
                {tagMessageStateResolver(
                  item.state,
                  item.sub_state,
                  item.active_state
                )}
              </Text>
            </span>
            <span className="flex-1" style={{ textAlign: "right" }}>
              <Dropdown.Button
                loading={isActionLoading[item.app_name] || false}
                overlay={() => (
                  <ConfirmActionMenu item={item} onMenuClick={onMenuClick} />
                )}
              />
            </span>
          </List.Item>
        )}
      />
    </div>
  );
};

export const HostsTable = (props: any) => {
  const { hosts, networks, isFetching, refreshList } = props;
  let { connUUID = "", netUUID = "", locUUID = "" } = useParams();
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
  const [isInstallRubixEdgeModalVisible, setIsInstallRubixEdgeModalVisible] = useState(false);
  const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);
  const [tokenFactory, setTokenFactory] = useState(new EdgeBiosTokenFactory(connUUID));

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
            <a onClick={(e) => {
              handlePing(host.uuid, e);
            }}>
              <LinkOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Edit">
            <a onClick={(e) => {
              showModal(host, e);
            }}>
              <FormOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Install">
            <a onClick={() => {
              openDialog(INSTALL_DIALOG, { state: host });
            }}>
              <DownloadOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Rubix-Wires and Backup">
            <a onClick={(e) => {
              showBackupModal(host, e);
            }}>
              <MenuFoldOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Install Rubix Edge">
            <a onClick={(e) => {
              showRubixEdgeInstallModal(host, e);
            }}>
              <CloudDownloadOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Tokens">
            <a onClick={(e) => {
              showTokenModal(host, e);
            }}>
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
    const _tokenFactory: EdgeBiosTokenFactory = new EdgeBiosTokenFactory(connUUID);
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
          expandedRowRender: (host: any) => (
            <ExpandedRow host={host} />
          ),
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
      <InstallApp
        isOpen={isOpen(INSTALL_DIALOG)}
        closeDialog={() => closeDialog(INSTALL_DIALOG)}
        dialogData={dialogData[INSTALL_DIALOG]}
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
