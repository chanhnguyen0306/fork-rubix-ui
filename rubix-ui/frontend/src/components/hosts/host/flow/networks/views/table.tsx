import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Space, Spin } from "antd";
import { FlowNetworkFactory } from "../factory";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { ROUTES } from "../../../../../../constants/routes";
import { NETWORK_HEADERS } from "../../../../../../constants/headers";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbExportButton,
  RbImportButton,
  RbRefreshButton,
} from "../../../../../../common/rb-table-actions";
import { CreateModal, EditModal } from "./create";
import { ExportModal, ImportModal } from "./import-export";
import "./style.css";

import UUIDs = main.UUIDs;
import Network = model.Network;

export const FlowNetworkTable = (props: any) => {
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
  } = useParams();
  const [currentItem, setCurrentItem] = useState({});
  const [networkSchema, setNetworkSchema] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [networks, setNetworks] = useState([] as Network[]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  let networkFactory = new FlowNetworkFactory();
  networkFactory.connectionUUID = connUUID;
  networkFactory.hostUUID = hostUUID;

  const columns = [
    ...NETWORK_HEADERS,
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

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      setIsFetching(true);
      let res = (await networkFactory.GetAll(false)) || [];
      setNetworks(res);
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

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
    setSelectedUUIDs([]);
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
      <div className="flow-networks-actions">
        <RbAddButton handleClick={() => setIsCreateModalVisible(true)} />
        <RbDeleteButton bulkDelete={bulkDelete} />
        <RbImportButton showModal={() => setIsImportModalVisible(true)} />
        <RbExportButton
          handleExport={() => setIsExportModalVisible(true)}
          disabled={selectedUUIDs.length === 0}
        />

        <RbRefreshButton refreshList={fetchNetworks} />
      </div>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={networks}
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
      <ExportModal
        isModalVisible={isExportModalVisible}
        onClose={() => setIsExportModalVisible(false)}
        selectedItems={selectedUUIDs}
      />
      <ImportModal
        isModalVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        refreshList={fetchNetworks}
      />
    </>
  );
};
