import {Button, Spin, Tag, Image} from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { FlowPluginFactory } from "../factory";
import { FlowNetworkFactory } from "../../networks/factory";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { CreateModal } from "./create";
import {main, model} from "../../../../../../../wailsjs/go/models";

import bacnetLogo from '../../../../../../assets/images/BACnet_logo.png';
import nubeLogo from '../../../../../../assets/images/Nube-logo.png';
import RbTable from "../../../../../../common/rb-table";

export const FlowPluginsTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, refreshList } = props;
  const [plugins, setPlugins] = useState([] as Array<model.PluginConf>);
  const [pluginsUUIDs, setPluginsUUIDs] = useState([] as Array<main.PluginUUIDs>);
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let factory = new FlowPluginFactory();
  let flowNetworkFactory = new FlowNetworkFactory();

  const enable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.BulkEnable(pluginsUUIDs);
  };

  const disable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    await factory.BulkDisable(pluginsUUIDs);
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
      let plg = plugins.at(0) as unknown as model.PluginConf
      const res = await flowNetworkFactory.Schema(
          connUUID,
          hostUUID,
          plg.name
      );
      const jsonSchema = {
        properties: res,
      };
      setNetworkSchema(jsonSchema);
      setIsLoadingForm(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };
  console.log(data)
  const columns = [
    {
      title: 'name',
      key: 'name',
      dataIndex: 'name',
      render(name: string) {
        let image = nubeLogo
        console.log(name)
        if (name == "bacnetmaster"){
          image = bacnetLogo
        }
        if (name == "bacnet"){
          image = bacnetLogo
        }

        return (
            <Image
                width={70}
                src={image}
            />
        );
      },
    },
    {
      title: 'name',
      key: 'name',
      dataIndex: 'name',
      render(plugin_name: string) {
        let colour = "#4d4dff"
        let text = plugin_name.toUpperCase()
        return (
            <Tag color={colour}>
              {text}
            </Tag>
        );
      },
    },
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: 'Tags',
      key: 'has_network',
      dataIndex: 'has_network',
      render(has_network: boolean) {
        let colour = "blue"
        let text = "non network plugin"
        if (has_network) {
          colour = "orange"
          text = "network driver"
        }
        return (
            <Tag color={colour}>
              {text}
            </Tag>
        );
      },
    },
    {
      title: "status",
      key: "enabled",
      dataIndex: "enabled",
      render(enabled: boolean) {
        let colour = "blue"
        let text = "disabled"
        if (enabled) {
          colour = "orange"
          text = "enabled"
        }
        return (
            <Tag color={colour}>
              {text}
            </Tag>
        );
      },
    },
  ];

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
      />
    </>
  );
};
