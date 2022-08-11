import { Space, Spin } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../../common/rb-table";
import { ROUTES } from "../../../../../../../constants/routes";
import { FLOW_NETWORK_HEADERS } from "../../../../../../../constants/headers";

import UUIDs = main.UUIDs;
import FlowNetwork = model.FlowNetwork;
import {
  RbAddButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { FlowFrameworkNetworkFactory } from "../factory";
import { CreateEditModal } from "./create";

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
    ...FLOW_NETWORK_HEADERS,
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

  const getSchema = () => {
    const schema = {
      properties: {
        name: {
          maxLength: 50,
          minLength: 2,
          title: "name",
          type: "string",
        },
        message: {
          title: "message",
          type: "string",
        },
        uuid: {
          readOnly: true,
          title: "uuid",
          type: "string",
        },
      },
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

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(selectedRows);

      setSelectedUUIDs(selectedRows);
    },
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
      <RbAddButton showModal={() => showModal({} as FlowNetwork)} />
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
