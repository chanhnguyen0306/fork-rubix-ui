import { Space, Spin } from "antd";
import { useEffect, useState } from "react";
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
import RbTableFilterNameInput from "../../../../../../common/rb-table-filter-name-input";
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
  const [dataSource, setDataSource] = useState(data);
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
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      filterDropdown: () => {
        return (
          <RbTableFilterNameInput
            defaultData={data}
            setFilteredData={setDataSource}
          />
        );
      },
    },
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

  useEffect(() => {
    return setDataSource(data);
  }, [data.length]);

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

  const handleExport = () => {
    if (selectedUUIDs.length === 0) {
      return openNotificationWithIcon("warning", `please select at least one`);
    }
    setIsExportModalVisible(true);
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
      <RbRestartButton handleClick={handleRestart} loading={isRestarting} />
      <RbAddButton handleClick={() => showCreateModal({} as Device)} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbImportButton showModal={() => setIsImportModalVisible(true)} />
      <RbExportButton handleExport={handleExport} />

      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={dataSource}
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
