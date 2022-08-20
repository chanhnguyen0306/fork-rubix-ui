import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, PaginationProps, Space, Spin } from "antd";
import { FileSyncOutlined } from "@ant-design/icons";
import { FlowNetworkFactory } from "../factory";
import { BackupFactory } from "../../../../../backups/factory";
import { main, model, storage } from "../../../../../../../wailsjs/go/models";
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
import { SidePanel } from "./side-panel";
import { ExportModal, ImportModal } from "./import-export";
import "./style.css";

import Backup = storage.Backup;
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
  const [sidePanelHeight, setSidePanelHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [backups, setBackups] = useState([] as Backup[]);
  const [networks, setNetworks] = useState([] as Network[]);
  const [isFetching, setIsFetching] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  let backupFactory = new BackupFactory();
  let networkFactory = new FlowNetworkFactory();
  networkFactory.connectionUUID = connUUID;
  networkFactory.hostUUID = hostUUID;
  const application = backupFactory.AppFlowFramework;
  const subApplication = backupFactory.SubFlowFrameworkNetwork;

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
    fetchBackups();
    fetchNetworks();
  }, []);

  useEffect(() => {
    setCollapsed(true);
    const totalPage = Math.ceil(networks.length / 10);
    setTotalPage(totalPage);
    sidePanelHeightHandle();
  }, [networks.length]);

  useEffect(() => {
    setCollapsed(true);
    sidePanelHeightHandle();
  }, [currentPage, selectedUUIDs]);

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

  const fetchBackups = async () => {
    try {
      let res =
        (await backupFactory.GetBackupsByApplication(
          application,
          subApplication,
          true
        )) || [];
      setBackups(res);
    } catch (error) {
      console.log(error);
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

  const sidePanelHeightHandle = () => {
    if (currentPage === totalPage) {
      const height = (networks.length % 10) * 60 + 55; //get height of last page
      setSidePanelHeight(height);
    } else {
      const height =
        networks.length >= 10 ? 10 * 60 + 55 : (networks.length % 10) * 60 + 55;
      setSidePanelHeight(height);
    }
  };

  const onChange: PaginationProps["onChange"] = ({ current }: any) => {
    setCurrentPage(current);
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
        <Button
          className="nube-primary white--text"
          disabled={selectedUUIDs.length !== 1}
          style={{ margin: "5px", float: "right" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FileSyncOutlined /> Backups
        </Button>
        <RbRefreshButton refreshList={fetchNetworks} />
      </div>

      <div className="flow-networks">
        <RbTable
          rowKey="uuid"
          rowSelection={rowSelection}
          dataSource={networks}
          columns={columns}
          loading={{ indicator: <Spin />, spinning: isFetching }}
          className={collapsed ? "full-width " : "uncollapsed-style "}
          onChange={onChange}
        />
        {selectedUUIDs[0] ? (
          <SidePanel
            collapsed={collapsed}
            selectedItem={selectedUUIDs[0]}
            sidePanelHeight={sidePanelHeight}
            backups={backups}
            refreshList={fetchNetworks}
          />
        ) : null}
      </div>

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
