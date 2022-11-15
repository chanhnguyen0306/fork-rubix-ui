import { Space, Spin, Tag, Tooltip } from "antd";
import { FormOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { model, backend } from "../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../common/rb-table";
import {
  RbExportButton,
  RbImportButton,
  RbDeleteButton,
  RbAddButton,
  RbRestartButton,
} from "../../../../../../common/rb-table-actions";
import RbTableFilterNameInput from "../../../../../../common/rb-table-filter-name-input";
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
import UUIDs = backend.UUIDs;
import PluginUUIDs = backend.PluginUUIDs;

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
  const [tableHeaders, setTableHeaders] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState(data);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isWritePointModalVisible, setIsWritePointModalVisible] =
    useState(false);

  const flowPointFactory = new FlowPointFactory();
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

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

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
    getTableHeaders(jsonSchema.properties);
  };

  const getTableHeaders = (schema: any) => {
    if (!schema) return;

    const columns = [
      {
        title: "name",
        dataIndex: "name",
        key: "name",
        render(name: string) {
          if (name != undefined) {
            let colour = "#4d4dff";
            return <Tag color={colour}>{name}</Tag>;
          }
        },
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
      {
        title: "plugin name",
        key: "plugin_name",
        dataIndex: "plugin_name",
        render() {
          let colour = "#4d4dff";
          let text = pluginName.toUpperCase();
          return <Tag color={colour}>{text}</Tag>;
        },
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      ...FLOW_POINT_HEADERS,
    ] as any;
    const columnKeys = columns.map((c: any) => c.key);

    let headers = Object.keys(schema).map((key) => {
      return {
        title: key.replaceAll("_", " "),
        dataIndex: key,
        key: key,
        sorter: (a: any, b: any) =>
          schema[key].type === "string"
            ? a[key].localeCompare(b[key])
            : a[key] - b[key],
      };
    });

    //styling columns
    headers = headers.map((header: any) => {
      if (columnKeys.includes(header.key)) {
        return columns.find((col: any) => col.key === header.key);
      } else {
        return header;
      }
    });

    const headerWithActions = [
      ...headers,
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_: any, point: Point) => (
          <Space size="middle">
            <Tooltip title="Edit">
              <a
                onClick={() => {
                  showEditModal(point);
                }}
              >
                <FormOutlined />
              </a>
            </Tooltip>
            <Tooltip title="Write Point">
              <a
                onClick={() => {
                  showWritePointModal(point);
                }}
              >
                <EditOutlined />
              </a>
            </Tooltip>
          </Space>
        ),
      },
    ];

    setTableHeaders(headerWithActions);
  };

  const showEditModal = (item: Point) => {
    setCurrentItem(item);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const showWritePointModal = (item: Point) => {
    setIsWritePointModalVisible(true);
    setCurrentItem(item);
  };

  useEffect(() => {
    setPlugin();
  }, []);

  useEffect(() => {
    return setDataSource(data);
  }, [data.length]);

  useEffect(() => {
    getSchema(pluginName);
  }, [pluginName]);

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
        dataSource={dataSource}
        columns={tableHeaders}
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
