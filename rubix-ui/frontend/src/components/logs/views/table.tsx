import { Spin } from "antd";
import { useState } from "react";
import { backend } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import { RbDeleteButton } from "../../../common/rb-table-actions";
import { LOG_HEADERS } from "../../../constants/headers";
import { LogFactory } from "../factory";

export const LogsTable = (props: any) => {
  const { logs, isFetching, fetch } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<backend.UUIDs>);
  const logFactory = new LogFactory();

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const bulkDelete = async () => {
    await logFactory.BulkDelete(selectedUUIDs);
    fetch();
  };

  return (
    <>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={logs}
        columns={LOG_HEADERS}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
