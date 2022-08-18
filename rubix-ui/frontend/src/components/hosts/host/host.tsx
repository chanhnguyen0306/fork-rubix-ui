import { Tabs, Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import RbxBreadcrumb from "../../breadcrumbs/breadcrumbs";
import { FlowNetworks } from "./flow/flowNetworks/networks/flow-networks";
import { FlowNetworkClones } from "./flow/flowNetworks/networkClones/network-clones";
import { FlowNetworkTable } from "./flow/networks/views/table";
import { FlowPluginsTable } from "./flow/plugins/views/table";
import { HostTable } from "./views/hostTable";

const { TabPane } = Tabs;
const { Title } = Typography;

const infoKey = "INFO";
const networksKey = "NETWORKS";
const pluginsKey = "PLUGINS";
const flownetworksKey = "FLOW NETWORKS";
const flownetworkClonesKey = "FLOW NETWORK CLONES";

export const Host = () => {
  let {
    connUUID = "",
    hostUUID = "",
    locUUID = "",
    netUUID = "",
  } = useParams();

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
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Networks
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <Tabs defaultActiveKey={networksKey}>
          <TabPane tab={networksKey} key={networksKey}>
            <FlowNetworkTable />
          </TabPane>
          <TabPane tab={pluginsKey} key={pluginsKey}>
            <FlowPluginsTable />
          </TabPane>
          <TabPane tab={infoKey} key={infoKey}>
            <HostTable />
          </TabPane>
          <TabPane tab={flownetworksKey} key={flownetworksKey}>
            <FlowNetworks />
          </TabPane>
          <TabPane tab={flownetworkClonesKey} key={flownetworkClonesKey}>
            <FlowNetworkClones />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};
