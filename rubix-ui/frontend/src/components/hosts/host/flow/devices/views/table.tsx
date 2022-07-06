import { Button, Space, Spin, Table } from "antd";
import { model } from "../../../../../../../wailsjs/go/models";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlowNetworkFactory } from "../../networks/factory";
import { FlowPointFactory } from "../../points/factory";
import { DeleteOutlined } from "@ant-design/icons";

import Device = model.Device;
import { isObjectEmpty } from "../../../../../../utils/utils";
import { FlowDeviceFactory } from "../factory";
import { EditModal } from "./edit";

export const FlowDeviceTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, networkUUID, refreshList } =
    props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [pluginName, setPluginName] = useState();
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as string[]);

  const navigate = useNavigate();
  let flowPointFactory = new FlowPointFactory();
  let flowDeviceFactory = new FlowDeviceFactory();

  const bulkDelete = async () => {
    flowPointFactory.connectionUUID = connUUID;
    flowPointFactory.hostUUID = hostUUID;
    // flowPointFactory.BulkDelete(selectedUUIDs);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRowKeys);
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
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, device: Device) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/flow/devices/${device.uuid}`, {
                // opens all points for a device
                state: {
                  connUUID: connUUID,
                  hostUUID: hostUUID,
                  networkUUID: networkUUID,
                  deviceUUID: device.uuid,
                },
              })
            }
          >
            View
          </a>
          <a
            onClick={() => {
              showModal(device);
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];

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

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    setPluginName(item.plugin_name);
    if (isObjectEmpty(schema)) {
      getSchema();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentItem({});
  };

  return (
    <>
      {/*<h3> DEVICES </h3>*/}
      <Button
        type="primary"
        danger
        onClick={bulkDelete}
        style={{ margin: "5px", float: "right" }}
      >
        <DeleteOutlined /> Delete
      </Button>
      <Table
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
        connUUID={connUUID}
        hostUUID={hostUUID}
        networkSchema={schema}
        onCloseModal={closeModal}
        refreshList={refreshList}
      />
    </>
  );
};
