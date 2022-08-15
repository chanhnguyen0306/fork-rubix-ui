import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Spin } from "antd";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { CONSUMER_HEADERS } from "../../../../../../../constants/headers";
import RbTable from "../../../../../../../common/rb-table";

import UUIDs = main.UUIDs;
import Consumer = model.Consumer;

import {
  RbAddButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { CreateEditModal } from "./create";
import { FlowConsumerFactory } from "../factory";

export const ConsumersTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  let { connUUID = "", hostUUID = "" } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [currentItem, setCurrentItem] = useState({} as Consumer);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let factory = new FlowConsumerFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...CONSUMER_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: Consumer) => (
        <Space size="middle">
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

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const showModal = (item: Consumer) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentItem({} as Consumer);
  };

  return (
    <>
      <RbRefreshButton refreshList={refreshList} />
      <RbAddButton showModal={() => showModal({} as Consumer)} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        currentItem={currentItem}
        isModalVisible={isModalVisible}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
      />
    </>
  );
};
