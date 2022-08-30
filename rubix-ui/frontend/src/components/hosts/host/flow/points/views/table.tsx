import { Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { model, main } from "../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../common/rb-table";
import {
  RbExportButton,
  RbImportButton,
  RbDeleteButton,
  RbAddButton,
  RbRestartButton,
} from "../../../../../../common/rb-table-actions";
import { FLOW_POINT_HEADERS } from "../../../../../../constants/headers";
import {
  isObjectEmpty,
  openNotificationWithIcon,
} from "../../../../../../utils/utils";
import { FlowNetworkFactory } from "../../networks/factory";
import { FlowPluginFactory } from "../../plugins/factory";
import { FlowPointFactory } from "../factory";
import { CreateModal } from "./create";
import { EditModal } from "./edit";
import { ExportModal, ImportModal } from "./import-export";
import { WritePointValueModal } from "./write-point-value";

import Point = model.Point;
import UUIDs = main.UUIDs;
import PluginUUIDs = main.PluginUUIDs;

export const FlowPointsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  const {
    connUUID = "",
    networkUUID = "",
    hostUUID = "",
    deviceUUID = "",
    pluginName = "",
  } = useParams();
  const [pluginUUID, setPluginUUID] = useState<any>();
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({} as Point);
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isWritePointModalVisible, setIsWritePointModalVisible] =
    useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  let flowPointFactory = new FlowPointFactory();
  const flowNetworkFactory = new FlowNetworkFactory();
  const flowPluginFactory = new FlowPluginFactory();
  flowPointFactory.connectionUUID =
    flowNetworkFactory.connectionUUID =
    flowPluginFactory.connectionUUID =
      connUUID;
  flowPointFactory.hostUUID =
    flowNetworkFactory.hostUUID =
    flowPluginFactory.hostUUID =
      hostUUID;

  const columns = [
    ...FLOW_POINT_HEADERS,
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
          <a
            onClick={() => {
              showWritePointModal(point);
            }}
          >
            Write Point
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
    setPlugin();
  }, []);

  const setPlugin = async () => {
    const res = await flowNetworkFactory.GetOne(networkUUID, false);
    setPluginUUID(res.plugin_conf_id);
  };

  const bulkDelete = async () => {
    await flowPointFactory.BulkDelete(selectedUUIDs);
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

  const getSchema = async (pluginName: string) => {
    setIsLoadingForm(true);
    const res = await flowPointFactory.Schema(connUUID, hostUUID, pluginName);
    const jsonSchema = {
      properties: res,
    };
    setSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showEditModal = (item: Point) => {
    setCurrentItem(item);
    setIsEditModalVisible(true);
    if (isObjectEmpty(schema)) {
      getSchema(pluginName);
    }
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    if (isObjectEmpty(schema)) {
      getSchema(pluginName);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const showWritePointModal = (item: Point) => {
    setIsWritePointModalVisible(true);
    setCurrentItem(item);
  };

  return (
    <>
      <RbRestartButton handleClick={handleRestart} loading={isRestarting} />
      <RbAddButton handleClick={showCreateModal} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbImportButton showModal={() => setIsImportModalVisible(true)} />
      <RbExportButton handleExport={handleExport} />

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
      <WritePointValueModal
        isModalVisible={isWritePointModalVisible}
        onCloseModal={() => setIsWritePointModalVisible(false)}
        point={currentItem}
        refreshList={refreshList}
      />
    </>
  );
};
