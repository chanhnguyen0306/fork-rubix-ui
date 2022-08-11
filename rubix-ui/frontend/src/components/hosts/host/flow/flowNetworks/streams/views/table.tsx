import { Space, Spin } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../../common/rb-table";
import { ROUTES } from "../../../../../../../constants/routes";
import { FLOW_NETWORK_HEADERS } from "../../../../../../../constants/headers";

import UUIDs = main.UUIDs;
import Stream = model.Stream;

import {
  RbAddButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { CreateEditModal } from "./create";
import { FlowStreamFactory } from "../factory";

export const StreamsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
    flNetworkUUID = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [schema, setSchema] = useState({});
  const [currentItem, setCurrentItem] = useState({} as Stream);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let factory = new FlowStreamFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...FLOW_NETWORK_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: Stream) => (
        <Space size="middle">
          <Link to={getNavigationLink(item.uuid)}>View Consumers</Link>
          <a
            onClick={() => {
              showModal(item);
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

  const getNavigationLink = (streamUUID: string): string => {
    return ROUTES.CONSUMERS.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":flNetworkUUID", flNetworkUUID)
      .replace(":streamUUID", streamUUID);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const showModal = (item: Stream) => {
    setCurrentItem(item);
    setIsModalVisible(true);
    getSchema();
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentItem({} as Stream);
  };

  return (
    <>
      <RbRefreshButton refreshList={refreshList} />
      <RbAddButton showModal={() => showModal({} as Stream)} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        schema={schema}
        currentItem={currentItem}
        isModalVisible={isModalVisible}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
      />
    </>
  );
};
