import { useState } from "react";
import { Spin } from "antd";
import { model } from "../../../../../../wailsjs/go/models";
import { BACNET_HEADERS } from "../../../../../constants/headers";
import RbTable from "../../../../../common/rb-table";

export const BacnetWhoIsTable = (props: any) => {
  const { data, isFetching } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<model.Device>);

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const columns = BACNET_HEADERS;

  return (
    <RbTable
      rowKey="uuid"
      rowSelection={rowSelection}
      dataSource={data}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};
