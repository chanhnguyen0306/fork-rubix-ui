import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { backend, model } from "../../../../../../../../wailsjs/go/models";
import { WriterClonesFactory } from "../factory";
import { WRITER_HEADERS } from "../../../../../../../constants/headers";
import RbTable from "../../../../../../../common/rb-table";
import {
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";

import UUIDs = backend.UUIDs;
import WriterClone = model.WriterClone;

export const WriterClonesTable = (props: any) => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [writerClones, setWriterClones] = useState([] as WriterClone[]);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new WriterClonesFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = WRITER_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll();
      setWriterClones(res);
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

  return (
    <>
      <RbRefreshButton refreshList={fetch} />
      <RbDeleteButton bulkDelete={bulkDelete} />

      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={writerClones}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
