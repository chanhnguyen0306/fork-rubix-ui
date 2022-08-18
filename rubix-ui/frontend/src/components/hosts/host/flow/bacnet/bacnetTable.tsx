import { Spin } from "antd";
import { useState } from "react";
import { model } from "../../../../../../wailsjs/go/models";
import { BACNET_HEADERS } from "../../../../../constants/headers";
import RbTable from "../../../../../common/rb-table";
import { RbAddButton } from "../../../../../common/rb-table-actions";

export const BacnetWhoIsTable = (props: any) => {
  const { data, isFetching, handleAdd, addBtnText } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<model.Device>);

  const columns = BACNET_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const Add = () => {
    handleAdd(selectedUUIDs);
  };

  return (
    <>
      <RbAddButton handleClick={Add} label={addBtnText} />
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
