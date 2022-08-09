import { Typography, Card } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FlowPointFactory } from "./factory";
import { FlowPointsTable } from "./views/table";
import { ROUTES } from "../../../../../constants/routes";
import { model } from "../../../../../../wailsjs/go/models";
import RbxBreadcrumb from "../../../../breadcrumbs/breadcrumbs";
import { RbRefreshButton } from "../../../../../common/rb-table-actions";

import Points = model.Point;

const { Title } = Typography;

export const FlowPoints = () => {
  const [data, setDevices] = useState([] as Points[]);
  const [isFetching, setIsFetching] = useState(false);
  let flowPointFactory = new FlowPointFactory();
  const {
    locUUID = "",
    netUUID = "",
    connUUID = "",
    hostUUID = "",
    deviceUUID = "",
    pluginName = "",
    networkUUID = "",
  } = useParams();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      flowPointFactory.connectionUUID = connUUID;
      flowPointFactory.hostUUID = hostUUID;
      let res = await flowPointFactory.GetPointsForDevice(deviceUUID);
      setDevices(res);
    } catch (error) {
      console.log(error);
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
    {
      path: "",
      breadcrumbName: "Flow Point",
    },
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Points
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes}></RbxBreadcrumb>
        <RbRefreshButton refreshList={fetch} />
        <FlowPointsTable
          data={data}
          isFetching={isFetching}
          refreshList={fetch}
          pluginName={pluginName}
        />
      </Card>
    </>
  );
};
