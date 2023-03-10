import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RbRefreshButton } from "../../../common/rb-table-actions";
import { Button, Card, Dropdown, List, Menu, Typography } from "antd";
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import RbVersion, { VERSION_STATES } from "../../../common/rb-version";
import RbTag from "../../../common/rb-tag";
import { tagMessageStateResolver } from "./utils";
import {
  InstallRubixAppModal
} from "./install-rubix-app/install-rubix-app-modal";
import { InstallAppFactory } from "./install-rubix-app/factory";
import { rumodel } from "../../../../wailsjs/go/models";
import { ReleasesFactory } from "../../release/factory";
import InstalledApps = rumodel.InstalledApps;
import AppsAvailableForInstall = rumodel.AppsAvailableForInstall;

const releaseFactory = new ReleasesFactory();
const { Text, Title } = Typography;
let installAppFactory = new InstallAppFactory();

export const AppInstallInfo = (props: any) => {
  let timeout;
  let { connUUID = "" } = useParams();
  installAppFactory.connectionUUID = connUUID;

  const [isLoading, updateIsLoading] = useState(false);
  const [isActionLoading, updateActionLoading] = useState({} as any);
  const [installedApps, updateInstalledApps] = useState([] as InstalledApps[]);
  const [availableApps, updateAvailableApps] = useState([] as AppsAvailableForInstall[]);
  const [appInfoMsg, updateAppInfoMsg] = useState("");
  const [selectedApp, updateSelectedApp] = useState({} as InstalledApps);
  const [installedVersion, updateInstalledVersion] = useState("");
  const [isInstallRubixAppModalVisible, updateIsInstallRubixAppModalVisible] = useState(false);
  const { host } = props;


  useEffect(() => {
    fetchAppInfo().catch(console.error);
    return () => {
      timeout = null;
    };
  }, []);

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
        fetchAppInfo().catch(console.log);
      })
      .finally(() => {
        updateActionLoading((prevState: any) => ({
          ...prevState,
          [item.app_name]: false,
        }));
      });
  };

  const setIsInstallRubixAppModalVisible = (item: any) => {
    const selectedInstalledApp = installedApps
      .find(app => app.app_name == item.app_name)?.version;
    updateSelectedApp(item);
    updateInstalledVersion(selectedInstalledApp || "");
    updateIsInstallRubixAppModalVisible(true);
  };

  const onCloseRubixAppInstallModal = () => {
    updateIsInstallRubixAppModalVisible(false);
  };

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
              description={`(${item.min_version || "Infinite"} - ${item.max_version || "Infinite"})`}
            />
            <DownloadOutlined
              onClick={() => setIsInstallRubixAppModalVisible(item)} />
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
            <span style={{ width: "250px" }}>
              <span>
                {item.app_name}
              </span>
            </span>
            <span style={{ width: 100, float: "right" }}>
              <RbVersion state={
                item.downgrade_required ?
                  VERSION_STATES.DOWNGRADE : item.upgrade_required ?
                    VERSION_STATES.UPGRADE : VERSION_STATES.NONE
              } version={item.version}>
              </RbVersion>
            </span>
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
                loading={isActionLoading[item.app_name || ""] || false}
                overlay={() => (
                  <ConfirmActionMenu item={item} onMenuClick={onMenuClick} />
                )}
              />
            </span>
          </List.Item>
        )}
      />
      <InstallRubixAppModal
        isModalVisible={isInstallRubixAppModalVisible}
        onCloseModal={onCloseRubixAppInstallModal}
        installFactory={installAppFactory}
        host={host}
        app={selectedApp}
        installedVersion={installedVersion}
        fetchAppInfo={fetchAppInfo}
      />
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
