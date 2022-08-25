import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Card, Tabs, Typography} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {FlowDeviceFactory} from "./factory";
import {BacnetFactory} from "../bacnet/factory";
import {BacnetWhoIsTable} from "../bacnet/bacnetTable";
import {model} from "../../../../../../wailsjs/go/models";
import {openNotificationWithIcon} from "../../../../../utils/utils";
import {PLUGINS} from "../../../../../constants/plugins";
import {ROUTES} from "../../../../../constants/routes";
import {BACNET_HEADERS} from "../../../../../constants/headers";
import RbxBreadcrumb from "../../../../breadcrumbs/breadcrumbs";
import {RbRefreshButton} from "../../../../../common/rb-table-actions";
import {FlowDeviceTable} from "./views/table";
import Device = model.Device;

const {TabPane} = Tabs;
const {Title} = Typography;

const devices = "DEVICES";
const bacnet = "BACNET";

export const FlowDevices = () => {
  const {
    connUUID = "",
    hostUUID = "",
    networkUUID = "",
    locUUID = "",
    netUUID = "",
    pluginName = "",
  } = useParams();
  const [data, setDevices] = useState([] as Device[]);
  const [isFetching, setIsFetching] = useState(false);
  const [whoIs, setWhoIs] = useState([] as Device[]);
  const [isFetchingWhoIs, setIsFetchingWhoIs] = useState(false);

  const bacnetFactory = new BacnetFactory();
  const flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = bacnetFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = bacnetFactory.hostUUID = hostUUID;

  const routes = [
    {
      path: ROUTES.CONNECTIONS,
      breadcrumbName: "Supervisors",
    },
    {
      path: ROUTES.LOCATIONS.replace(":connUUID", connUUID || ""),
      breadcrumbName: "Location",
    },
    {
      path: ROUTES.LOCATION_NETWORKS.replace(
        ":connUUID",
        connUUID || ""
      ).replace(":locUUID", locUUID || ""),
      breadcrumbName: "Location Network",
    },
    {
      path: ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID),
      breadcrumbName: "Hosts",
    },
    {
      path: ROUTES.HOST.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID || "")
        .replace(":hostUUID", hostUUID || ""),
      breadcrumbName: "Flow Networks",
    },
    {
      path: ROUTES.DEVICES.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID || "")
        .replace(":hostUUID", hostUUID || "")
        .replace(":pluginName", pluginName || "")
        .replace(":networkUUID", networkUUID || ""),
      breadcrumbName: "Flow Devices",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      let res = await flowDeviceFactory.GetNetworkDevices(networkUUID);
      setDevices(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const runWhois = async () => {
    try {
      setIsFetchingWhoIs(true);
      const res = await bacnetFactory.Whois(networkUUID, pluginName);
      if (res) {
        openNotificationWithIcon(
          "success",
          `device count found: ${res.length}`
        );
      }
      setWhoIs(res);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", `discovery error: ${error}`);
    } finally {
      setIsFetchingWhoIs(false);
    }
  };

  const addDevices = async (selectedUUIDs: Array<Device>) => {
    await flowDeviceFactory.AddBulk(selectedUUIDs);
    fetch();
  };

  return (
    <>
      <Title level={3} style={{textAlign: "left"}}>
        Flow Devices
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes}/>
        <Tabs defaultActiveKey={devices}>
          <TabPane tab={devices} key={devices}>
            <RbRefreshButton refreshList={fetch}/>
            <FlowDeviceTable
              data={data}
              isFetching={isFetching}
              refreshList={fetch}
            />
          </TabPane>
          {pluginName === PLUGINS.bacnetmaster ? (
            <TabPane tab={bacnet} key={bacnet}>
              <Button
                type="primary"
                onClick={runWhois}
                style={{margin: "5px", float: "right"}}
              >
                <RedoOutlined/> WHO-IS
              </Button>
              <BacnetWhoIsTable
                refreshDeviceList={fetch}
                data={whoIs}
                isFetching={isFetchingWhoIs}
                handleAdd={addDevices}
                addBtnText="Create Devices"
                headers={BACNET_HEADERS}
              />
            </TabPane>
          ) : null}
        </Tabs>
      </Card>
    </>
  );
};
