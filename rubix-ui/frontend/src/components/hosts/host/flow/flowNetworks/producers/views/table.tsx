import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Spin } from "antd";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { FlowProducerFactory } from "../factory";
import { PRODUCER_HEADERS } from "../../../../../../../constants/headers";
import RbTable from "../../../../../../../common/rb-table";
import {
  RbAddButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { CreateEditModal } from "./create";

import UUIDs = main.UUIDs;
import Producer = model.Producer;

export const ProducersTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  let { connUUID = "", hostUUID = "" } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [currentItem, setCurrentItem] = useState({} as Producer);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let factory = new FlowProducerFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...PRODUCER_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: Producer) => (
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

  const showModal = (item: Producer) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentItem({} as Producer);
  };

  return (
    <>
      <RbRefreshButton refreshList={refreshList} />
      <RbAddButton showModal={() => showModal({} as Producer)} />
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
