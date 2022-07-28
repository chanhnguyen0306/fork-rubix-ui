import { useParams } from "react-router-dom";
import { RedoOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Button, Tabs, Card, Typography } from "antd";

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

const { Title } = Typography;

export const FlowDevices = () => {
  const [data, setDevices] = useState([] as Devices[]);
  const [isFetching, setIsFetching] = useState(true);
  const [whoIs, setWhois] = useState([] as model.Device[]);
  let flowDeviceFactory = new FlowDeviceFactory();
  const {
    connUUID = "",
    hostUUID = "",
    networkUUID = "",
    locUUID = "",
    netUUID = "",
    pluginName = "",
  } = useParams();

  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      flowDeviceFactory.connectionUUID = connUUID;
      flowDeviceFactory.hostUUID = hostUUID;
      let res = await flowDeviceFactory.GetNetworkDevices(networkUUID);
      setDevices(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  let bacnetFactory = new BacnetFactory();
  const runWhois = async () => {
    try {
      openNotificationWithIcon("info", `run bacnet discovery....`);
      bacnetFactory.connectionUUID = connUUID;
      bacnetFactory.hostUUID = hostUUID;
      let res = await bacnetFactory.Whois(networkUUID, pluginName);
      openNotificationWithIcon("success", `device count found: ${res.length}`);
      setWhois(res);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", `discovery error: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

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

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Devices
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes}></RbxBreadcrumb>
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="DEVICES" key="1">
            <RbRefreshButton refreshList={fetch} />
            <FlowDeviceTable
              data={data}
              isFetching={isFetching}
              connUUID={connUUID}
              hostUUID={hostUUID}
              networkUUID={networkUUID}
              setIsFetching={setIsFetching}
              refreshList={fetch}
              pluginName={pluginName}
            />
          </TabPane>
          <TabPane tab="BACNET" key="3">
            <Button
              type="primary"
              onClick={runWhois}
              style={{ margin: "5px", float: "right" }}
            >
              <RedoOutlined /> WHO-IS
            </Button>
            <BacnetWhoIsTable
              data={whoIs}
              isFetching={isFetching}
              setIsFetching={setIsFetching}
            />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};
