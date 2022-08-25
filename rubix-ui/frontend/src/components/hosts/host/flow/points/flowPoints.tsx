import { Typography, Card, Tabs, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FlowPointFactory } from "./factory";
import { BacnetFactory } from "../bacnet/factory";
import { ROUTES } from "../../../../../constants/routes";
import { model } from "../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../utils/utils";
import RbxBreadcrumb from "../../../../breadcrumbs/breadcrumbs";
import { FLOW_POINT_HEADERS } from "../../../../../constants/headers";
import { PLUGINS } from "../../../../../constants/plugins";
import { RbRefreshButton } from "../../../../../common/rb-table-actions";
import { BacnetWhoIsTable } from "../bacnet/bacnetTable";
import { FlowPointsTable } from "./views/table";

import Point = model.Point;

const { TabPane } = Tabs;
const { Title } = Typography;

const points = "POINTS";
const discover = "DISCOVER";

export const FlowPoints = () => {
  const [data, setDevices] = useState([] as Point[]);
  const [discoveries, setDiscoveries] = useState([] as Point[]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingDiscoveries, setIsFetchingDiscoveries] = useState(false);
  const {
    locUUID = "",
    netUUID = "",
    connUUID = "",
    hostUUID = "",
    deviceUUID = "",
    pluginName = "",
    networkUUID = "",
  } = useParams();

  const flowPointFactory = new FlowPointFactory();
  const bacnetFactory = new BacnetFactory();
  flowPointFactory.connectionUUID = bacnetFactory.connectionUUID = connUUID;
  flowPointFactory.hostUUID = bacnetFactory.hostUUID = hostUUID;

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
    {
      path: "",
      breadcrumbName: "Flow Point",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await flowPointFactory.GetPointsForDevice(deviceUUID);
      setDevices(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const runDiscover = async () => {
    try {
      setIsFetchingDiscoveries(true);
      const res = await bacnetFactory.DiscoverDevicePoints(
        deviceUUID,
        false,
        false
      );
      if (res) {
        openNotificationWithIcon("success", `discoveries: ${res.length}`);
      }
      setDiscoveries(res);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", `discovery error: ${error}`);
    } finally {
      setIsFetchingDiscoveries(false);
    }
  };

  const addPoints = async (selectedUUIDs: Array<Point>) => {
    await flowPointFactory.AddBulk(selectedUUIDs);
    fetch();
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Points
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <Tabs defaultActiveKey={points}>
          <TabPane tab={points} key={points}>
            <RbRefreshButton refreshList={fetch} />
            <FlowPointsTable
              data={data}
              isFetching={isFetching}
              refreshList={fetch}
              pluginName={pluginName}
            />
          </TabPane>
          {pluginName === PLUGINS.bacnetmaster ? (
            <TabPane tab={discover} key={discover}>
              <Button
                type="primary"
                onClick={runDiscover}
                style={{ margin: "5px", float: "right" }}
              >
                <RedoOutlined /> Discover
              </Button>
              <BacnetWhoIsTable
                refreshDeviceList={fetch}
                data={discoveries}
                isFetching={isFetchingDiscoveries}
                handleAdd={addPoints}
                addBtnText="Create Points"
                headers={FLOW_POINT_HEADERS}
              />
            </TabPane>
          ) : null}
        </Tabs>
      </Card>
    </>
  );
};
