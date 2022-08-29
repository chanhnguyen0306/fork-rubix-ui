import {
  Typography,
  Tag,
  List,
  Button,
  Space,
  Spin,
  Tooltip,
  Popover,
  Dropdown,
  Menu,
} from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
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
import { ReleasesFactory } from "../../release/factory";
import { HostsFactory } from "../factory";
import InstallApp from "./installApp";
import { BackupModal, CreateEditModal } from "./modals";
import RbConfirmPopover from "../../../common/rb-confirm-popover";

import "./style.css";

import Host = assistmodel.Host;
import Location = assistmodel.Location;
import Backup = storage.Backup;
import UUIDs = main.UUIDs;

const { Text, Title } = Typography;
const releaseFactory = new ReleasesFactory();

const INSTALL_DIALOG = "INSTALL_DIALOG";

interface BadgeDetailI {
  [name: string]: {
    title: string;
    color: string;
  };
}
enum APPLICATION_STATES {
  ENABLED = "enabled",
  DISABLED = "disabled",
  ACTIVE = "active",
  INACTIVE = "inactive",
  RUNNING = "running",
  ACTIVATING = "activating",
  AUTORESTART = "auto-restart",
  DEAD = "dead",
}
const badgeDetails: BadgeDetailI = {
  [APPLICATION_STATES.ENABLED]: {
    title: "Enabled",
    color: "green",
  },
  [APPLICATION_STATES.DISABLED]: {
    title: "Disabled",
    color: "red",
  },
  [APPLICATION_STATES.ACTIVE]: {
    title: "Active",
    color: "blue",
  },
  [APPLICATION_STATES.INACTIVE]: {
    title: "Inactive",
    color: "orange",
  },
  [APPLICATION_STATES.ACTIVATING]: {
    title: "Activating",
    color: "yellow",
  },
  [APPLICATION_STATES.RUNNING]: {
    title: "Running",
    color: "green",
  },
  [APPLICATION_STATES.DEAD]: {
    title: "Dead",
    color: "volcano",
  },
  [APPLICATION_STATES.AUTORESTART]: {
    title: "Auto-Restart",
    color: "pink",
  },
  default: {
    title: "",
    color: "",
  },
};

const tagMessageStateResolver = (
  state: string,
  subState: string,
  activeState: string
) => {
  if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.ACTIVE &&
    subState === APPLICATION_STATES.RUNNING
  ) {
    return "Application is enabled and running";
  } else if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.ACTIVATING &&
    subState === APPLICATION_STATES.AUTORESTART
  ) {
    return "Application is enabled and auto restarting.";
  } else if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.INACTIVE &&
    subState === APPLICATION_STATES.DEAD
  ) {
    return "Application enabled but is stopped.";
  } else if (
    state === APPLICATION_STATES.DISABLED &&
    activeState === APPLICATION_STATES.ACTIVE &&
    subState === APPLICATION_STATES.RUNNING
  ) {
    return "Application operations are disabled but running in background.";
  } else if (
    state === APPLICATION_STATES.DISABLED &&
    activeState === APPLICATION_STATES.INACTIVE &&
    subState === APPLICATION_STATES.DEAD
  ) {
    return "Application is disabled and stopped.";
  }
};

const RbxTag = (props: any) => {
  const { state } = props;
  let badgeDetail = badgeDetails[state];
  if (!badgeDetail) {
    return <Tag>{state}</Tag>;
  }

  return <Tag color={badgeDetail.color}>{badgeDetail.title}</Tag>;
};

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
      <AppInstallInfo {...props}></AppInstallInfo>
    </div>
  );
};

const AppInstallInfo = (props: any) => {
  const [product, updateProduct] = useState({});
  const [isLoading, updateIsLoading] = useState(false);
  const [installedApps, updateInstalledApps] = useState([] as InstalledAppI[]);
  const [availableApps, updateAvailableApps] = useState([] as AvailableAppI[]);
  const [appInfoMsg, updateAppInfoMsg] = useState("");
  const { host } = props;
  const { connUUID = "" } = useParams();
  useEffect(() => {
    fetchAppInfo();
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
        payload.appVersion
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
        if (appInfo.product) {
          updateProduct(appInfo.product);
        }
        if (appInfo.installed_apps) {
          updateInstalledApps(appInfo.installed_apps);
        }
        if (appInfo.apps_available_for_install) {
          updateAvailableApps(appInfo.apps_available_for_install);
        }
      })
      .catch((err) => {
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
          <a onClick={fetchAppInfo}>Click here to refresh</a>
        </span>
      </span>
    );
  }

  const onMenuClick = (value: any, item: any) => {
    return releaseFactory.EdgeServiceAction(value.key, {
      connUUID: connUUID,
      hostUUID: host.uuid,
      appName: item.app_name,
    });
  };

  const menu = (item: any) => (
    <Menu
      onClick={(v) => onMenuClick(v, item)}
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
      ]}
    />
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid #dfdfdf",
        }}
      >
        <Title level={5}>App details</Title>
        <RbRefreshButton
          style={{ marginLeft: 10 }}
          refreshList={fetchAppInfo}
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
            ></RbConfirmPopover>
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
                <RbxTag state={item.state} />
                <RbxTag state={item.sub_state} />
                <RbxTag state={item.active_state} />
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
              <Dropdown.Button overlay={() => menu(item)}></Dropdown.Button>
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
          <a
            onClick={(e) => {
              handlePing(host.uuid, e);
            }}
          >
            Ping
          </a>
          <Link
            to={ROUTES.HOST.replace(":connUUID", connUUID)
              .replace(":locUUID", locUUID)
              .replace(":netUUID", netUUID)
              .replace(":hostUUID", host.uuid)}
          >
            View Networks
          </Link>
          <a
            onClick={(e) => {
              showModal(host, e);
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
            <a
              onClick={(e) => {
                showBackupModal(host, e);
              }}
            >
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
    try {
      let res = (await backupFactory.GetBackupsRubixWires()) || [];
      setBackups(res);
    } catch (error) {
      console.log(error);
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

  const handlePing = async (uuid: string, e: any) => {
    e.stopPropagation();
    factory.uuid = uuid;
    await factory.PingHost();
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

  const onCloseBackupModal = () => {
    setIsBackupModalVisible(false);
    setCurrentHost({} as Host);
  };

  return (
    <div>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbAddButton handleClick={(e: any) => showModal({} as Host, e)} />
      <RbRefreshButton refreshList={refreshList} />

      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
        expandable={{
          expandedRowRender: (host: any) => (
            <ExpandedRow host={host}></ExpandedRow>
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
    </div>
  );
};
