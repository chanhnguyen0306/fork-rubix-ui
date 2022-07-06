import { Space, Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { FlowDeviceFactory } from "../factory";
import { model } from "../../../../../../../wailsjs/go/models";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { useState } from "react";
import { EditModal } from "./edit";
import Device = model.Device;

export const FlowDeviceTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, networkUUID, refreshList } =
    props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [pluginName, setPluginName] = useState();
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({});

  const navigate = useNavigate();
  let flowDeviceFactory = new FlowDeviceFactory();

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
          <a
            onClick={() => {
              // deleteNetwork(network.uuid);
            }}
          >
            Delete
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
      <h3> DEVICES </h3>
      <Table
        rowKey="uuid"
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
