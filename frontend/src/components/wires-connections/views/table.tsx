import { Spin } from "antd";
import { useState } from "react";
import { backend } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import { RbDeleteButton } from "../../../common/rb-table-actions";
import { WIRES_CONNECTIONS_HEADERS } from "../../../constants/headers";
import { FlowFactory } from "../../rubix-flow/factory";

export const WiresConnectionsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<string>);

  const factory = new FlowFactory();

  const columns = WIRES_CONNECTIONS_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRowKeys);
    },
  };

  const bulkDelete = async () => {
    console.log(selectedUUIDs);

    try {
      await factory.BulkDeleteWiresConnection(selectedUUIDs);
    } catch (error) {
      console.log(error);
    } finally {
      refreshList();
    }
  };

  return (
    <>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
