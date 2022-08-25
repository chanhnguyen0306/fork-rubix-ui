import { Space, Spin } from "antd";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { model, main } from "../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../common/rb-table";
import {
  RbExportButton,
  RbImportButton,
  RbDeleteButton,
  RbAddButton,
  RbRestartButton,
} from "../../../../../../common/rb-table-actions";
import { FLOW_DEVICE_HEADERS } from "../../../../../../constants/headers";
import { ROUTES } from "../../../../../../constants/routes";
import {
  isObjectEmpty,
  openNotificationWithIcon,
} from "../../../../../../utils/utils";
import { FlowPluginFactory } from "../../plugins/factory";
import { FlowDeviceFactory } from "../factory";
import { CreateModal } from "./create";
import { EditModal } from "./edit";
import { ExportModal, ImportModal } from "./import-export";

import Device = model.Device;
import UUIDs = main.UUIDs;
import PluginUUIDs = main.PluginUUIDs;

export const FlowDeviceTable = (props: any) => {
  const {
    connUUID = "",
    locUUID = "",
    netUUID = "",
    hostUUID = "",
    networkUUID = "",
    pluginName = "",
  } = useParams();
  const { data, isFetching, refreshList, pluginUUID } = props;
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  const flowDeviceFactory = new FlowDeviceFactory();
  const flowPluginFactory = new FlowPluginFactory();
  flowDeviceFactory.connectionUUID = flowPluginFactory.connectionUUID =
    connUUID;
  flowDeviceFactory.hostUUID = flowPluginFactory.hostUUID = hostUUID;

  const columns = [
    ...FLOW_DEVICE_HEADERS,
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, device: Device) => (
        <Space size="middle">
          <Link to={getNavigationLink(device.uuid)}>View Points</Link>
          <a
            onClick={() => {
              showEditModal(device);
            }}
          >
            Edit
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

  const bulkDelete = async () => {
    if (selectedUUIDs.length === 0) {
      return openNotificationWithIcon("warning", `please select at least one`);
    }
    await flowDeviceFactory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    const pluginUUIDs = [
      { name: pluginName, uuid: pluginUUID },
    ] as PluginUUIDs[];
    await flowPluginFactory.RestartBulk(pluginUUIDs);
    setIsRestarting(false);
  };

  const getNavigationLink = (deviceUUID: string): string => {
    return ROUTES.POINTS.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":networkUUID", networkUUID)
      .replace(":deviceUUID", deviceUUID)
      .replace(":pluginName", pluginName);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await flowDeviceFactory.Schema(
      connUUID,
      hostUUID,
      pluginName as unknown as string
    );
    const jsonSchema = {
      properties: res,
    };
    setSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showEditModal = (item: any) => {
    setCurrentItem(item);
    setIsEditModalVisible(true);
    if (isObjectEmpty(schema)) {
      getSchema();
    }
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setCurrentItem({});
  };

  const showCreateModal = (item: any) => {
    setIsCreateModalVisible(true);
    if (isObjectEmpty(schema)) {
      getSchema();
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <>
      <RbExportButton
        handleExport={() => setIsExportModalVisible(true)}
        disabled={selectedUUIDs.length === 0}
      />
      <RbImportButton showModal={() => setIsImportModalVisible(true)} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbAddButton handleClick={() => showCreateModal({} as Device)} />
      <RbRestartButton handleClick={handleRestart} loading={isRestarting} />

      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <EditModal
        currentItem={currentItem}
        isModalVisible={isEditModalVisible}
        isLoadingForm={isLoadingForm}
        schema={schema}
        onCloseModal={closeEditModal}
        refreshList={fetch}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        isLoadingForm={isLoadingForm}
        schema={schema}
        onCloseModal={closeCreateModal}
        refreshList={fetch}
      />
      <ExportModal
        isModalVisible={isExportModalVisible}
        onClose={() => setIsExportModalVisible(false)}
        selectedItems={selectedUUIDs}
      />
      <ImportModal
        isModalVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        refreshList={fetch}
      />
    </>
  );
};
