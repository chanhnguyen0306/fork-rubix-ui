import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Tabs, Card, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { assistmodel, model } from "../../../../wailsjs/go/models";
import { HostsFactory } from "../factory";
import { HostTable } from "./views/hostTable";
import { FlowNetworkFactory } from "./flow/networks/factory";
import { FlowNetworkTable } from "./flow/networks/views/table";
import { FlowPluginFactory } from "./flow/plugins/factory";
import { FlowPluginsTable } from "./flow/plugins/views/table";
import { ROUTES } from "../../../constants/routes";
import RbxBreadcrumb from "../../breadcrumbs/breadcrumbs";
import { FlowNetworks } from "./flow/flowNetworks/networks/flow-networks";

const networksKey = "NETWORKS";
const pluginsKey = "PLUGINS";
const flownetworksKey = "FLOW NETWORKS";
const infoKey = "INFO";

const { Title } = Typography;

export const Host = () => {
  let {
    connUUID = "",
    hostUUID = "",
    locUUID = "",
    netUUID = "",
  } = useParams();

  const [host, setHost] = useState({} as assistmodel.Host);
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [plugins, setPlugins] = useState([] as model.PluginConf[]);
  const [isFetching, setIsFetching] = useState(true);

  let hostFactory = new HostsFactory();
  let networkFactory = new FlowNetworkFactory();
  let flowPluginFactory = new FlowPluginFactory();

  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    if (key == pluginsKey) {
      fetchPlugins();
    }
    if (key == networksKey) {
      fetchNetworks();
    }
  };
  useEffect(() => {
    fetchHost();
    fetchNetworks();
  }, []);

  const fetchHost = async () => {
    try {
      hostFactory.connectionUUID = connUUID;
      hostFactory.uuid = hostUUID;
      let res = (await hostFactory.GetOne()) || [];
      setHost(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchPlugins = async () => {
    try {
      flowPluginFactory.connectionUUID = connUUID;
      flowPluginFactory.hostUUID = hostUUID;
      let res = (await flowPluginFactory.GetAll()) || [];
      setPlugins(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

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
            <FlowPluginsTable
              data={plugins}
              isFetching={isFetching}
              connUUID={connUUID}
              hostUUID={hostUUID}
              setIsFetching={setIsFetching}
              fetchPlugins={fetchPlugins}
            />
          </TabPane>
          <TabPane tab={infoKey} key={infoKey}>
            <HostTable
              data={host}
              isFetching={isFetching}
              setIsFetching={setIsFetching}
            />
          </TabPane>
          <TabPane tab={flownetworksKey} key={flownetworksKey}>
            <FlowNetworks />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};
