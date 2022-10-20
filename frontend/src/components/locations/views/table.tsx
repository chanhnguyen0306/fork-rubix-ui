import { Spin } from "antd";
import { useState } from "react";
import { backend } from "../../../../wailsjs/go/models";
import { LocationFactory } from "../factory";
import RbTable from "../../../common/rb-table";
import { RbDeleteButton } from "../../../common/rb-table-actions";

export const LocationsTable = (props: any) => {
  let { locations, isFetching, tableSchema, connUUID, refreshList } = props;
  if (!locations) return <></>;

  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<backend.UUIDs>);

  let factory = new LocationFactory();
  factory.connectionUUID = connUUID as string;

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  return (
    <div>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={locations}
        columns={tableSchema}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
