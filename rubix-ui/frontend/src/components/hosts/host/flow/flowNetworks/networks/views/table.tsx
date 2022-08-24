import { Space, Spin } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FlowFrameworkNetworkFactory } from "../factory";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { ROUTES } from "../../../../../../../constants/routes";
import {
  FLOW_NETWORKS_HEADERS,
  FLOW_NETWORKS_SCHEMA,
} from "../../../../../../../constants/headers";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import RbTable from "../../../../../../../common/rb-table";
import { CreateEditModal } from "./create";

import UUIDs = main.UUIDs;
import FlowNetwork = model.FlowNetwork;

export const FlowNetworksTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [schema, setSchema] = useState({});
  const [currentNetwork, setCurrentNetwork] = useState({} as FlowNetwork);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let factory = new FlowFrameworkNetworkFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...FLOW_NETWORKS_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: FlowNetwork) => (
        <Space size="middle">
          <Link to={getNavigationLink(network.uuid)}>View Streams</Link>
          <a
            onClick={() => {
              showModal(network);
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
    await factory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const getSchema = () => {
    const schema = {
      properties: FLOW_NETWORKS_SCHEMA,
    };
    setSchema(schema);
  };

  const getNavigationLink = (flNetworkUUID: string): string => {
    return ROUTES.STREAMS.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":flNetworkUUID", flNetworkUUID);
  };

  const showModal = (network: FlowNetwork) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
    getSchema();
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentNetwork({} as FlowNetwork);
  };

  return (
    <>
      <RbRefreshButton refreshList={refreshList} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbAddButton handleClick={() => showModal({} as FlowNetwork)} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        schema={schema}
        currentItem={currentNetwork}
        isModalVisible={isModalVisible}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
      />
    </>
  );
};
