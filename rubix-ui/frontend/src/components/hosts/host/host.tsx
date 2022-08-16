import { Button, Tabs, Card, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { model } from "../../../../wailsjs/go/models";
import { ROUTES } from "../../../constants/routes";
import RbxBreadcrumb from "../../breadcrumbs/breadcrumbs";
import { FlowNetworks } from "./flow/flowNetworks/networks/flow-networks";
import { FlowNetworkClones } from "./flow/flowNetworks/networkClones/network-clones";
import { FlowNetworkFactory } from "./flow/networks/factory";
import { FlowNetworkTable } from "./flow/networks/views/table";
import { FlowPluginsTable } from "./flow/plugins/views/table";
import { HostTable } from "./views/hostTable";

const infoKey = "INFO";
const networksKey = "NETWORKS";
const pluginsKey = "PLUGINS";
const flownetworksKey = "FLOW NETWORKS";
const flownetworkClonesKey = "FLOW NETWORK CLONES";

const { Title } = Typography;

export const Host = () => {
  let {
    connUUID = "",
    hostUUID = "",
    locUUID = "",
    netUUID = "",
  } = useParams();

  const [networks, setNetworks] = useState([] as model.Network[]);
  const [isFetching, setIsFetching] = useState(true);

  let networkFactory = new FlowNetworkFactory();

  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    if (key == networksKey) {
      fetchNetworks();
    }
  };
  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      setIsFetching(true);
      networkFactory.connectionUUID = connUUID;
      networkFactory.hostUUID = hostUUID;
      let res = (await networkFactory.GetAll(false)) || [];
      setNetworks(res);
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
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Flow Networks
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <Tabs defaultActiveKey={networksKey} onChange={onChange}>
          <TabPane tab={networksKey} key={networksKey}>
            <Button
              type="primary"
              onClick={fetchNetworks}
              style={{ margin: "5px", float: "right" }}
            >
              <RedoOutlined /> Refresh
            </Button>
            <FlowNetworkTable
              data={networks}
              isFetching={isFetching}
              connUUID={connUUID}
              hostUUID={hostUUID}
              setIsFetching={setIsFetching}
              fetchNetworks={fetchNetworks}
            />
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
