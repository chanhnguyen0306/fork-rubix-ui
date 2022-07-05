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
import { CreateEditModal } from "./flow/networks/views/edit";
import { isObjectEmpty } from "../../../utils/utils";

let networksKey = "NETWORKS";
let pluginsKey = "PLUGINS";

export const Host = () => {
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";

  const [currentItem, setCurrentItem] = useState({});
  const [host, setHost] = useState({} as assistmodel.Host);
  const [networkSchema, setnetworkSchema] = useState({});
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

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await networkFactory.Schema(connUUID, hostUUID, "bacnetmaster");
    const jsonSchema = {
      properties: res,
    };
    setnetworkSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentItem({});
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
            setIsFetching={setIsFetching}
            connUUID={connUUID}
            hostUUID={hostUUID}
            showModal={showModal}
          />
          <CreateEditModal
            currentItem={currentItem}
            isModalVisible={isModalVisible}
            isLoadingForm={isLoadingForm}
            connUUID={connUUID}
            hostUUID={hostUUID}
            networkSchema={networkSchema}
            refreshList={fetchNetworks}
            onCloseModal={closeModal}
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
