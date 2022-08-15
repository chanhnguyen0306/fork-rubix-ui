import { Space, Spin } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FlowStreamFactory } from "../factory";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import RbTable from "../../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { ROUTES } from "../../../../../../../constants/routes";
import { STREAM_HEADERS } from "../../../../../../../constants/headers";
import { CreateEditModal } from "./create";

import UUIDs = main.UUIDs;
import Stream = model.Stream;

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
    ...STREAM_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: Stream) => (
        <Space size="middle">
          <Link to={getNavigationLink(item.uuid)}>View Producers</Link>
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

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const getSchema = () => {
    const schema = {
      properties: {
        name: {
          maxLength: 50,
          minLength: 2,
          title: "name",
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
    return ROUTES.PRODUCERS.replace(":connUUID", connUUID)
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
      <RbDeleteButton bulkDelete={bulkDelete} />
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
