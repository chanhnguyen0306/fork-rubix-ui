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

export const FlowPluginsTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, fetchPlugins } = props;
  const [plugins, setPlugins] = useState([] as Array<model.PluginConf>);
  const [pluginName, setPluginName] = useState<string>();
  const [pluginsUUIDs, setPluginsUUIDs] = useState(
    [] as Array<main.PluginUUIDs>
  );
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let factory = new FlowPluginFactory();
  let flowNetworkFactory = new FlowNetworkFactory();

  const columns = PLUGIN_HEADERS;

  useEffect(() => {
    if (isModalVisible) {
      getSchema();
    }
  }, [pluginsUUIDs, isModalVisible]);

  const enable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.BulkEnable(pluginsUUIDs);
    fetchPlugins();
  };

  const disable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.BulkDisable(pluginsUUIDs);
    fetchPlugins();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: Array<model.PluginConf>) => {
      setPluginsUUIDs(selectedRows);
      setPlugins(selectedRows);
    },
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    if (plugins.length > 0) {
      let plg = plugins.at(0) as unknown as model.PluginConf;
      setPluginName(plg.name);
      const res = await flowNetworkFactory.Schema(connUUID, hostUUID, plg.name);
      const jsonSchema = {
        properties: res,
      };
      setNetworkSchema(jsonSchema);
      setIsLoadingForm(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={enable}
        style={{ margin: "5px", float: "right" }}
      >
        <PlayCircleOutlined /> Enable Plugins
      </Button>
      <Button
        type="ghost"
        onClick={disable}
        style={{ margin: "5px", float: "right" }}
      >
        <StopOutlined /> Disable Plugins
      </Button>
      <Button
        type="ghost"
        onClick={showModal}
        style={{ margin: "5px", float: "right" }}
      >
        <PlusOutlined /> Add Network
      </Button>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
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
