import { Button, Image, Popconfirm, Space, Spin, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlowNetworkFactory } from "../factory";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { main, model } from "../../../../../../../wailsjs/go/models";
import { EditModal } from "./edit";
import { DeleteOutlined } from "@ant-design/icons";
import nubeLogo from "../../../../../../assets/images/Nube-logo.png";
import bacnetLogo from "../../../../../../assets/images/BACnet_logo.png";
import RbTable from "../../../../../../common/rb-table";
import "./style.css";
export const FlowNetworkTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, refreshList } = props;
  const [currentItem, setCurrentItem] = useState({});
  const [networkSchema, setNetworkSchema] = useState({});
  const [pluginName, setPluginName] = useState();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
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
      setSelectedUUIDs(selectedRows);
    },
  };
  const navigate = useNavigate();
  const columns = [
    {
      title: "network",
      key: "plugin_name",
      dataIndex: "plugin_name",
      render(name: string) {
        let image = nubeLogo;
        console.log(name);
        if (name == "bacnetmaster") {
          image = bacnetLogo;
        }
        if (name == "bacnet") {
          image = bacnetLogo;
        }

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
      <Popconfirm title="Delete" onConfirm={bulkDelete}>
        <Button type="primary" danger style={{ margin: "5px", float: "right" }}>
          <DeleteOutlined /> Delete
        </Button>
      </Popconfirm>
      <RbTable
        className="flow-networks"
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
