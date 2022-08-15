import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Spin } from "antd";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { FlowProducerFactory } from "../factory";
import { PRODUCER_HEADERS } from "../../../../../../../constants/headers";
import RbTable from "../../../../../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import { CreateEditModal } from "./create";

import UUIDs = main.UUIDs;
import Producer = model.Producer;

export const ProducersTable = (props: any) => {
  let { connUUID = "", hostUUID = "" } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [producers, setProducers] = useState([] as Producer[]);
  const [currentItem, setCurrentItem] = useState({} as Producer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll();
      setProducers(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    fetch();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <RbRefreshButton refreshList={fetch} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbAddButton showModal={() => showModal({} as Producer)} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={producers}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        currentItem={currentItem}
        isModalVisible={isModalVisible}
        refreshList={fetch}
        onCloseModal={onCloseModal}
      />
    </>
  );
};
