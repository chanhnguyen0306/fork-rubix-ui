import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Tabs } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { assistmodel, model } from "../../../../wailsjs/go/models";
import { HostsFactory } from "../factory";
import { HostTable } from "./views/hostTable";
import { FlowNetworkFactory } from "./flow/networks/factory";
import { FlowNetworkTable } from "./flow/networks/views/table";
import { FlowPluginFactory } from "./flow/plugins/factory";
import { FlowPluginsTable } from "./flow/plugins/views/table";

let networksKey = "NETWORKS";
let pluginsKey = "PLUGINS";

export const Host = () => {
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";

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
  };
  useEffect(() => {
    fetchHost();
    fetchNetworks();
    // runWhois();
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

  return (
    <>
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
            refreshList={fetchNetworks}
          />
        </TabPane>
        <TabPane tab={pluginsKey} key={pluginsKey}>
          <Button
            type="primary"
            onClick={fetchPlugins}
            style={{ margin: "5px", float: "right" }}
          >
            <RedoOutlined /> Refresh
          </Button>
          <FlowPluginsTable
            data={plugins}
            isFetching={isFetching}
            connUUID={connUUID}
            hostUUID={hostUUID}
            setIsFetching={setIsFetching}
          />
        </TabPane>
        <TabPane tab="INFO" key="INFO">
          <HostTable
            data={host}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
          />
        </TabPane>
      </Tabs>
    </>
  );
};
