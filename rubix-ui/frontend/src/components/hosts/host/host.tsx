import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Modal, Tabs } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { assistmodel, model } from "../../../../wailsjs/go/models";
import { HostsFactory } from "../factory";
import { HostTable } from "./views/hostTable";
import { FlowNetworkFactory } from "./flow/networks/factory";
import { FlowNetworkTable } from "./flow/networks/views/table";
import { FlowPluginFactory } from "./flow/plugins/factory";
import { FlowPluginsTable } from "./flow/plugins/views/table";
import { CreateEditModal } from "./flow/networks/views/create";

export const Host = () => {
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";

  const [currentItem, setCurrentItem] = useState({});
  const [host, setHost] = useState({} as assistmodel.Host);
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [plugins, setPlugins] = useState([] as model.PluginConf[]);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let hostFactory = new HostsFactory();
  let networkFactory = new FlowNetworkFactory();
  let flowPluginFactory = new FlowPluginFactory();

  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    console.log(key);
  };
  useEffect(() => {
    fetchHost();
    fetchPlugins();
    fetchNetworks();
    // runWhois();
  }, []);

  const fetchHost = async () => {
    try {
      hostFactory.connectionUUID = connUUID;
      hostFactory.uuid = hostUUID;
      let res = await hostFactory.GetOne();
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
      let res = await flowPluginFactory.GetAll();
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
      let res = await networkFactory.GetAll(false);
      setNetworks(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  return (
    <>
      <Tabs defaultActiveKey="NETWORKS" onChange={onChange}>
        <TabPane tab="NETWORKS" key="NETWORKS">
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
            setIsFetching={setIsFetching}
            connUUID={connUUID}
            hostUUID={hostUUID}
            showModal={showModal}
          />
          <CreateEditModal
            currentItem={currentItem}
            isModalVisible={isModalVisible}
            isLoadingForm={isLoadingForm}
            refreshList={fetchNetworks}
            onCloseModal={() => setIsModalVisible(false)}
            connUUID={connUUID}
          />
        </TabPane>
        <TabPane tab="PLUGINS" key="PLUGINS">
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
            setIsFetching={setIsFetching}
            connUUID={connUUID}
            hostUUID={hostUUID}
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
