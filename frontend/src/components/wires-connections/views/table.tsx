import { Spin } from "antd";
import { useState } from "react";
import { db } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import { RbAddButton, RbDeleteButton } from "../../../common/rb-table-actions";
import {
  WIRES_CONNECTIONS_HEADERS,
  WIRES_CONNECTION_SCHEMA,
} from "../../../constants/headers";
import { FlowFactory } from "../../rubix-flow/factory";
import { CreateModal } from "./create";
import Connection = db.Connection;

export const WiresConnectionsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<string>);
  const [schema, setSchema] = useState({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const factory = new FlowFactory();

  const columns = WIRES_CONNECTIONS_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRowKeys);
    },
  };

  const bulkDelete = async () => {
    try {
      await factory.BulkDeleteWiresConnection(selectedUUIDs);
    } catch (error) {
      console.log(error);
    } finally {
      refreshList();
    }
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    const schema = {
      properties: WIRES_CONNECTION_SCHEMA,
    };
    setSchema(schema);
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <>
      <RbAddButton handleClick={showCreateModal} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateModal
        isModalVisible={isCreateModalVisible}
        schema={schema}
        onCloseModal={closeCreateModal}
        refreshList={refreshList}
      />
    </>
  );
};
