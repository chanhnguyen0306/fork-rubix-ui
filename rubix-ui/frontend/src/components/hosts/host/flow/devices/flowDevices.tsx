import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Tabs, Card, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { FlowDeviceFactory } from "./factory";
import { FlowDeviceTable } from "./views/table";
import { BacnetFactory } from "../bacnet/factory";
import { BacnetWhoIsTable } from "../bacnet/bacnetTable";
import { ROUTES } from "../../../../../constants/routes";
import { model } from "../../../../../../wailsjs/go/models";
import RbxBreadcrumb from "../../../../breadcrumbs/breadcrumbs";
import { openNotificationWithIcon } from "../../../../../utils/utils";
import { RbRefreshButton } from "../../../../../common/rb-table-actions";

import Devices = model.Device;
import { BACNET_HEADERS } from "../../../../../constants/headers";

const { TabPane } = Tabs;
const { Title } = Typography;

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
  const [data, setDevices] = useState([] as Devices[]);
  const [isFetching, setIsFetching] = useState(false);
  const [whoIs, setWhoIs] = useState([] as model.Device[]);
  const [isFetchingWhoIs, setIsFetchingWhoIs] = useState(false);

  const bacnetFactory = new BacnetFactory();
  const flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = bacnetFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = bacnetFactory.hostUUID = hostUUID;

  const routes = [
    {
      path: ROUTES.CONNECTIONS,
      breadcrumbName: "Connections",
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

  const addDevices = async (selectedUUIDs: Array<model.Device>) => {
    const payload = {
      name: selectedUUIDs[0].name,
      enable: true,
      host: selectedUUIDs[0].host,
      port: selectedUUIDs[0].port,
      device_object_id: selectedUUIDs[0].device_object_id,
      device_mac: selectedUUIDs[0].device_mac,
      segmentation: selectedUUIDs[0].segmentation,
      max_adpu: selectedUUIDs[0].max_adpu,
    } as model.Device;
    const add = await flowDeviceFactory.Add(networkUUID, payload);
    if (add && add.name != undefined) {
      openNotificationWithIcon("success", `add device: ${add.name} success`);
    }
    fetch();
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Devices
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <Tabs defaultActiveKey={devices}>
          <TabPane tab={devices} key={devices}>
            <RbRefreshButton refreshList={fetch} />
            <FlowDeviceTable
              data={data}
              isFetching={isFetching}
              refreshList={fetch}
            />
          </TabPane>
          <TabPane tab={bacnet} key={bacnet}>
            <Button
              type="primary"
              onClick={runWhois}
              style={{ margin: "5px", float: "right" }}
            >
              <RedoOutlined /> WHO-IS
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
        </Tabs>
      </Card>
    </>
  );
};
