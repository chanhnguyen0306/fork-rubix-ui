import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Space, Spin } from "antd";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { FlowDeviceFactory } from "../factory";
import { ROUTES } from "../../../../../../constants/routes";
import { FLOW_DEVICE_HEADERS } from "../../../../../../constants/headers";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbExportButton,
  RbImportButton,
} from "../../../../../../common/rb-table-actions";
import { ExportModal, ImportModal } from "./import-export";
import { EditModal } from "./edit";
import { CreateModal } from "./create";

import Device = model.Device;

export const FlowDeviceTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  const {
    connUUID = "",
    locUUID = "",
    netUUID = "",
    hostUUID = "",
    networkUUID = "",
    pluginName = "",
  } = useParams();
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  const flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = hostUUID;

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
    await flowDeviceFactory.BulkDelete(selectedUUIDs);
    refreshList();
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
        refreshList={refreshList}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        isLoadingForm={isLoadingForm}
        schema={schema}
        onCloseModal={closeCreateModal}
        refreshList={refreshList}
      />
      <ExportModal
        isModalVisible={isExportModalVisible}
        onClose={() => setIsExportModalVisible(false)}
        selectedItems={selectedUUIDs}
      />
      <ImportModal
        isModalVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        refreshList={refreshList}
      />
    </>
  );
};
