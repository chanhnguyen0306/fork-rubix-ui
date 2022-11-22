import { useEffect, useState } from "react";
import { Button, notification, Spin } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { FlowPluginFactory } from "../factory";
import { FlowNetworkFactory } from "../../networks/factory";
import { backend, model } from "../../../../../../../wailsjs/go/models";
import { PLUGIN_HEADERS } from "../../../../../../constants/headers";
import RbTable from "../../../../../../common/rb-table";
import { RbButton } from "../../../../../../common/rb-table-actions";
import { CreateModal } from "./create";
import { useParams } from "react-router-dom";

import PluginConf = model.PluginConf;
import PluginUUIDs = backend.PluginUUIDs;
import { openNotificationWithIcon } from "../../../../../../utils/utils";

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

  const EnablePluginsButton = () => {
    const enable = async () => {
      await factory.BulkEnable(pluginsUUIDs);
      fetchPlugins();
    };

    return (
      <RbButton
        type="primary"
        text="enable plugins"
        icon={<PlayCircleOutlined />}
        onClick={enable}
      />
    );
  };

  const DisablePluginsButton = () => {
    const disable = async () => {
      await factory.BulkDisable(pluginsUUIDs);
      fetchPlugins();
    };

    return (
      <RbButton
        type="ghost"
        text="disable plugins"
        onClick={disable}
        icon={<StopOutlined />}
      />
    );
  };

  const AddNetworkButton = () => {
    const showModal = () => {
      setIsModalVisible(true);
    };

    return (
      <RbButton
        type="ghost"
        text="add network"
        onClick={showModal}
        icon={<PlusOutlined />}
      />
    );
  };

  const InstallButton = () => {
    const install = async () => {
      if (pluginsUUIDs.length !== 1)
        return openNotificationWithIcon("warning", `please select ONE plugin`);
      const plugin = pluginsUUIDs[0] as any;
      try {
        await factory.InstallPlugin(connUUID, hostUUID, plugin);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <RbButton
        text="install"
        onClick={install}
        style={{ backgroundColor: "#fa8c16", color: "white" }}
      />
    );
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    if (pluginsUUIDs.length > 0) {
      const plg = pluginsUUIDs.at(0) as unknown as PluginConf;
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
      const res = await factory.GetAll();
      setPlugins(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      getSchema();
    }
  }, [pluginsUUIDs, isModalVisible]);

  return (
    <>
      <EnablePluginsButton />
      <DisablePluginsButton />
      <AddNetworkButton />
      <InstallButton />
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
