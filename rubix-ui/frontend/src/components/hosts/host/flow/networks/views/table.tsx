import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Image, PaginationProps, Space, Spin, Tag } from "antd";
import { ROUTES } from "../../../../../../constants/routes";
import { FileSyncOutlined } from "@ant-design/icons";
import { FlowNetworkFactory } from "../factory";
import { BackupFactory } from "../../../../../backups/factory";
import { main, model, storage } from "../../../../../../../wailsjs/go/models";
import {
  openNotificationWithIcon,
  pluginLogo,
} from "../../../../../../utils/utils";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbImportButton,
} from "../../../../../../common/rb-table-actions";
import { ImportJsonModal } from "../../../../../../common/import-json-modal";
import { CreateModal, EditModal } from "./create";
import { SidePanel } from "./side-panel";
import "./style.css";

import Backup = storage.Backup;

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
  const [sidePanelHeight, setSidePanelHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [collapsed, setCollapsed] = useState(true);
  const [backups, setBackups] = useState([] as Backup[]);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  let backupFactory = new BackupFactory();
  let networkFactory = new FlowNetworkFactory();
  networkFactory.connectionUUID = connUUID;
  networkFactory.hostUUID = hostUUID;
  const application = backupFactory.AppFlowFramework;
  const subApplication = backupFactory.SubFlowFrameworkNetwork;

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

  useEffect(() => {
    fetchBackups();
  }, []);

  useEffect(() => {
    setCollapsed(true);
    const totalPage = Math.ceil(data.length / 10);
    setTotalPage(totalPage);
    sidePanelHeightHandle();
  }, [data.length]);

  useEffect(() => {
    setCollapsed(true);
    sidePanelHeightHandle();
  }, [currentPage, selectedUUIDs]);

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

  const handleImport = async (item: any) => {
    try {
      const network = JSON.parse(item);
      // await networkFactory.Import(true, true, network);
      fetchNetworks();
      setIsImportModalVisible(false);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Invalid JSON");
    }
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

  const sidePanelHeightHandle = () => {
    if (currentPage === totalPage) {
      const height = (data.length % 10) * 60 + 55; //get height of last page
      setSidePanelHeight(height);
    } else {
      const height =
        data.length >= 10 ? 10 * 60 + 55 : (data.length % 10) * 60 + 55;
      setSidePanelHeight(height);
    }
  };

  const onChange: PaginationProps["onChange"] = ({ current }: any) => {
    setCurrentPage(current);
  };

  return (
    <>
      <div className="flow-networks-actions">
        <RbAddButton showModal={() => setIsCreateModalVisible(true)} />
        <RbDeleteButton bulkDelete={bulkDelete} />
        <Button
          className="nube-primary white--text"
          disabled={selectedUUIDs.length !== 1}
          style={{ margin: "5px", float: "right" }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FileSyncOutlined /> Backups
        </Button>
        <RbImportButton showModal={() => setIsImportModalVisible(true)} />
      </div>

      <div className="flow-networks">
        <RbTable
          rowKey="uuid"
          rowSelection={rowSelection}
          dataSource={data}
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
      <ImportJsonModal
        isModalVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        onOk={handleImport}
      />
    </>
  );
};
