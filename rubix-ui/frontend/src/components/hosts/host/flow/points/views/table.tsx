import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Spin } from "antd";
import { FlowPointFactory } from "../factory";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { isObjectEmpty } from "../../../../../../utils/utils";
import RbTable from "../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbExportButton,
  RbImportButton,
} from "../../../../../../common/rb-table-actions";
import { EditModal } from "./edit";
import { CreateModal } from "./create";
import { ExportModal, ImportModal } from "./import-export";

import Point = model.Point;

export const FlowPointsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  const {
    connUUID = "",
    hostUUID = "",
    deviceUUID = "",
    pluginName = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  let flowPointFactory = new FlowPointFactory();
  flowPointFactory.connectionUUID = connUUID;
  flowPointFactory.hostUUID = hostUUID;

  const bulkDelete = async () => {
    await flowPointFactory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
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
      title: "device",
      dataIndex: "device_uuid",
      key: "device_uuid",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, point: Point) => (
        <Space size="middle">
          <a
            onClick={() => {
              showEditModal(point);
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];

  const getSchema = async (pluginName: string) => {
    setIsLoadingForm(true);
    const res = await flowPointFactory.Schema(connUUID, hostUUID, pluginName);
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
      getSchema(pluginName);
    }
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setCurrentItem({});
  };

  const showCreateModal = (item: any) => {
    setIsCreateModalVisible(true);
    if (isObjectEmpty(schema)) {
      getSchema(pluginName);
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
      <RbAddButton showModal={() => showCreateModal({} as Point)} />
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
        connUUID={connUUID}
        hostUUID={hostUUID}
        schema={schema}
        onCloseModal={closeEditModal}
        refreshList={refreshList}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        isLoadingForm={isLoadingForm}
        connUUID={connUUID}
        hostUUID={hostUUID}
        deviceUUID={deviceUUID}
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
