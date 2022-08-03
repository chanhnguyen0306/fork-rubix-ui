import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Image, Popconfirm, Space, Spin, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FlowNetworkFactory } from "../factory";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { isObjectEmpty, pluginLogo } from "../../../../../../utils/utils";
import { ROUTES } from "../../../../../../constants/routes";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
} from "../../../../../../common/rb-table-actions";
import "./style.css";
import { CreateModal, EditModal } from "./create";

export const FlowNetworkTable = (props: any) => {
  const { data, isFetching, fetchNetworks } = props;
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
  } = useParams();
  const [currentItem, setCurrentItem] = useState({});
  const [networkSchema, setNetworkSchema] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let networkFactory = new FlowNetworkFactory();

  const columns = [
    {
      title: "network",
      key: "plugin_name",
      dataIndex: "plugin_name",
      render(name: string) {
        let image = pluginLogo(name);
        return <Image width={70} preview={false} src={image} />;
      },
    },
    {
      title: "network-type",
      key: "plugin_name",
      dataIndex: "plugin_name",
      render(plugin_name: string) {
        let colour = "#4d4dff";
        let text = plugin_name.toUpperCase();
        return <Tag color={colour}>{text}</Tag>;
      },
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: model.Network) => (
        <Space size="middle">
          <Link to={getNavigationLink(network.uuid, network.plugin_name || "")}>
            View Devices
          </Link>
          <a // edit
            onClick={() => {
              showModal(network);
            }}
          >
            Edit Network
          </a>
        </Space>
      ),
    },
  ];

  const getSchema = async (pluginName: string) => {
    setIsLoadingForm(true);
    const res = await networkFactory.Schema(connUUID, hostUUID, pluginName);
    const jsonSchema = {
      properties: res,
    };
    setNetworkSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    getSchema(item.plugin_name);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentItem({});
  };

  const bulkDelete = async () => {
    networkFactory.connectionUUID = connUUID;
    networkFactory.hostUUID = hostUUID;
    await networkFactory.BulkDelete(selectedUUIDs);
    fetchNetworks();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const getNavigationLink = (
    networkUUID: string,
    pluginName: string
  ): string => {
    return ROUTES.DEVICES.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":networkUUID", networkUUID)
      .replace(":pluginName", pluginName);
  };

  return (
    <>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbAddButton showModal={() => setIsCreateModalVisible(true)} />

      <RbTable
        className="flow-networks"
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <EditModal
        currentItem={currentItem}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        connUUID={connUUID}
        hostUUID={hostUUID}
        networkSchema={networkSchema}
        refreshList={fetchNetworks}
        onCloseModal={closeModal}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        onCloseModal={() => setIsCreateModalVisible(false)}
        refreshList={fetchNetworks}
      />
    </>
  );
};
