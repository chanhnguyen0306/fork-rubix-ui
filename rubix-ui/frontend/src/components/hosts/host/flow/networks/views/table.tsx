import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image, Space, Spin, Tag } from "antd";
import { ROUTES } from "../../../../../../constants/routes";
import { FlowNetworkFactory } from "../factory";
import { main, model } from "../../../../../../../wailsjs/go/models";
import {
  downloadJSON,
  openNotificationWithIcon,
  pluginLogo,
} from "../../../../../../utils/utils";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbExportButton,
  RbImportButton,
} from "../../../../../../common/rb-table-actions";
import { ImportModal } from "../../../../../../common/import-modal";
import { CreateModal, EditModal } from "./create";
import "./style.css";

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
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let networkFactory = new FlowNetworkFactory();
  networkFactory.connectionUUID = connUUID;
  networkFactory.hostUUID = hostUUID;

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
    await networkFactory.BulkDelete(selectedUUIDs);
    fetchNetworks();
  };

  const handleExport = async () => {
    try {
      const item = selectedUUIDs[0] as any;
      downloadJSON(item.name, JSON.stringify(item));
    } catch (error) {
      console.log(error);
    }
  };

  const handleImport = async (item: any) => {
    try {
      const network = JSON.parse(item);
      await networkFactory.Import(true, true, network);
      fetchNetworks();
      setIsImportModalVisible(false);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Invalid JSON");
    }
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
      <RbExportButton
        handleExport={handleExport}
        disabled={selectedUUIDs.length !== 1}
      />
      <RbImportButton showModal={() => setIsImportModalVisible(true)} />
      <RbAddButton showModal={() => setIsCreateModalVisible(true)} />
      <RbDeleteButton bulkDelete={bulkDelete} />

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
        networkSchema={networkSchema}
        refreshList={fetchNetworks}
        onCloseModal={closeModal}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        onCloseModal={() => setIsCreateModalVisible(false)}
        refreshList={fetchNetworks}
      />
      <ImportModal
        isModalVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        onOk={handleImport}
      />
    </>
  );
};
