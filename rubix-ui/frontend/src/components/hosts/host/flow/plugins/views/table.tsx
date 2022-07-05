import { Button, Spin, Table } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { FlowPluginFactory } from "../factory";
import { FlowNetworkFactory } from "../../networks/factory";
import { CreateModal } from "./create";
import { isObjectEmpty } from "../../../../../../utils/utils";

export const FlowPluginsTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, refreshList } = props;
  const [plugins, setPlugins] = useState([] as string[]);
  const [networkSchema, setnetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let factory = new FlowPluginFactory();
  let flowNetworkFactory = new FlowNetworkFactory();

  if (!data) return <></>;

  for (const val of data) {
    if (val.enabled) {
      // react is crap and can't render a bool
      val.enabled = "enabled";
    } else {
      val.enabled = "disabled";
    }
  }

  const enable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    factory.BulkEnable(plugins);
  };

  const disable = async () => {
    factory.connectionUUID = connUUID;
    factory.hostUUID = hostUUID;
    factory.BulkDisable(plugins);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setPlugins(selectedRowKeys);
    },
  };

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "plugin",
      dataIndex: "module_path",
      key: "module_path",
    },
    {
      title: "status",
      key: "enabled",
      dataIndex: "enabled",
      render(enabled: string) {
        return {
          props: {
            style: { background: enabled == "enabled" ? "#e6ffee" : "#d1d1e0" },
          },
          children: <div>{enabled}</div>,
        };
      },
    },
  ];

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await flowNetworkFactory.Schema(
      connUUID,
      hostUUID,
      "bacnetmaster"
    );
    const jsonSchema = {
      properties: res,
    };
    setnetworkSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
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
      <Table
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
