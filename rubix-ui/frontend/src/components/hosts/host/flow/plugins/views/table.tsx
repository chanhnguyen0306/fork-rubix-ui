import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { FlowPluginFactory } from "../factory";
import { FlowNetworkFactory } from "../../networks/factory";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { PLUGIN_HEADERS } from "../../../../../../constants/headers";
import RbTable from "../../../../../../common/rb-table";
import { CreateModal } from "./create";
import { useParams } from "react-router-dom";

import PluginConf = model.PluginConf;
import PluginUUIDs = main.PluginUUIDs;

export const FlowPluginsTable = (props: any) => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [plugins, setPlugins] = useState([] as Array<PluginConf>);
  const [pluginName, setPluginName] = useState<string>();
  const [pluginsUUIDs, setPluginsUUIDs] = useState([] as Array<PluginUUIDs>);
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const flowNetworkFactory = new FlowNetworkFactory();
  const factory = new FlowPluginFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = PLUGIN_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: Array<model.PluginConf>) => {
      setPluginsUUIDs(selectedRows);
    },
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      getSchema();
    }
  }, [pluginsUUIDs, isModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const enable = async () => {
    await factory.BulkEnable(pluginsUUIDs);
    fetchPlugins();
  };

  const disable = async () => {
    await factory.BulkDisable(pluginsUUIDs);
    fetchPlugins();
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    if (pluginsUUIDs.length > 0) {
      let plg = pluginsUUIDs.at(0) as unknown as PluginConf;
      setPluginName(plg.name);
      const res = await flowNetworkFactory.Schema(connUUID, hostUUID, plg.name);
      const jsonSchema = {
        properties: res,
      };
      setNetworkSchema(jsonSchema);
      setIsLoadingForm(false);
    }
  };

  const fetchPlugins = async () => {
    try {
      setIsFetching(true);
      let res = (await factory.GetAll()) || [];
      setPlugins(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={enable}
        style={{ margin: "0 6px 10px 0", float: "left" }}
      >
        <PlayCircleOutlined /> Enable Plugins
      </Button>
      <Button
        type="ghost"
        onClick={disable}
        style={{ margin: "0 6px 10px 0", float: "left" }}
      >
        <StopOutlined /> Disable Plugins
      </Button>
      <Button
        type="ghost"
        onClick={showModal}
        style={{ margin: "0 6px 10px 0", float: "left" }}
      >
        <PlusOutlined /> Add Network
      </Button>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={plugins}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateModal
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        connUUID={connUUID}
        hostUUID={hostUUID}
        networkSchema={networkSchema}
        onCloseModal={() => setIsModalVisible(false)}
        pluginName={pluginName}
      />
    </>
  );
};
