import { Button, Space, Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlowNetworkFactory } from "../factory";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { model } from "../../../../../../../wailsjs/go/models";
import { EditModal } from "./edit";
import { DeleteOutlined } from "@ant-design/icons";

export const FlowNetworkTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, refreshList } = props;
  const [currentItem, setCurrentItem] = useState({});
  const [networkSchema, setNetworkSchema] = useState({});
  const [pluginName, setPluginName] = useState();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as string[]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let networkFactory = new FlowNetworkFactory();

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await networkFactory.Schema(
      connUUID,
      hostUUID,
      pluginName as unknown as string
    );
    const jsonSchema = {
      properties: res,
    };
    setNetworkSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    setPluginName(item.plugin_name);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentItem({});
  };

  const bulkDelete = async () => {
    networkFactory.connectionUUID = connUUID;
    networkFactory.hostUUID = hostUUID;
    networkFactory.BulkDelete(selectedUUIDs);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRowKeys);
    },
  };
  const navigate = useNavigate();
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
      title: "network-type",
      dataIndex: "plugin_name",
      key: "plugin_name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: model.Network) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/flow/networks/${network.uuid}`, {
                // opens devices
                state: {
                  connUUID: connUUID,
                  hostUUID: hostUUID,
                  networkUUID: network.uuid,
                },
              })
            }
          >
            View Devices
          </a>
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

  return (
    <>
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
        networkSchema={networkSchema}
        refreshList={refreshList}
        onCloseModal={closeModal}
      />
    </>
  );
};
