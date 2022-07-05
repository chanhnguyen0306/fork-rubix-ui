import { Button, Form, Modal, Space, Spin, Table } from "antd";
import { model } from "../../../../../../../wailsjs/go/models";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { RedoOutlined } from "@ant-design/icons";
import { EditModal } from "./edit";
import { isObjectEmpty } from "../../../../../../utils/utils";
import { FlowNetworkFactory } from "../factory";

export const FlowNetworkTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, refreshList } = props;
  const [currentItem, setCurrentItem] = useState({});
  const [networkSchema, setnetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let networkFactory = new FlowNetworkFactory();

  if (!data) return <></>;

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
            View
          </a>
          <a // edit
            onClick={() => {
              showModal(network);
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
    const res = await networkFactory.Schema(connUUID, hostUUID, "bacnetmaster");
    const jsonSchema = {
      properties: res,
    };
    setnetworkSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const showModal = (item: any) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentItem({});
  };

  return (
    <>
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
        networkSchema={networkSchema}
        refreshList={refreshList}
        onCloseModal={closeModal}
      />
    </>
  );
};
