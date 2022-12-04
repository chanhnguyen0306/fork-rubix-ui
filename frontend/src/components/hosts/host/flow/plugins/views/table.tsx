import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { FlowPluginFactory } from "../factory";
import { FlowNetworkFactory } from "../../networks/factory";
import { PLUGIN_HEADERS } from "../../../../../../constants/headers";
import RbTable from "../../../../../../common/rb-table";
import { CreateModal } from "./create";
import { useParams } from "react-router-dom";

export const FlowPluginsTable = (props: any) => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [plugins, setPlugins] = useState([] as any);
  const [pluginName, setPluginName] = useState<string>();
  const [pluginsNames, setPluginsNames] = useState([] as Array<string>);
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
    onChange: (selectedRowKeys: any, selectedRows: Array<any>) => {
      setPluginsNames(selectedRows.map(x => x.name));
    },
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      getSchema();
    }
  }, [pluginsNames, isModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const enable = async () => {
    await factory.BulkEnable(pluginsNames);
    await fetchPlugins();
  };

  const disable = async () => {
    await factory.BulkDisable(pluginsNames);
    await fetchPlugins();
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    if (pluginsNames.length > 0) {
      const pluginName = pluginsNames.at(0) || "";
      setPluginName(pluginName);
      const res = await flowNetworkFactory.Schema(connUUID, hostUUID, pluginName);
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
      const res = await factory.GetAll();
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
