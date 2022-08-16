import { Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FlowStreamCloneFactory } from "../factory";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { ROUTES } from "../../../../../../../constants/routes";
import { STREAM_HEADERS } from "../../../../../../../constants/headers";
import RbTable from "../../../../../../../common/rb-table";
import {
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";

import UUIDs = main.UUIDs;
import StreamClone = model.StreamClone;

export const StreamClonesTable = () => {
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
    flNetworkCloneUUID = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [streamClones, setStreamClones] = useState([] as StreamClone[]);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowStreamCloneFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...STREAM_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: StreamClone) => (
        <Space size="middle">
          <Link to={getNavigationLink(item.uuid)}>View Consumers</Link>
        </Space>
      ),
    },
  ];

  const getNavigationLink = (streamCloneUUID: string): string => {
    return ROUTES.CONSUMERS.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":flNetworkCloneUUID", flNetworkCloneUUID)
      .replace(":streamCloneUUID", streamCloneUUID);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    fetch();
  };

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll();
      setStreamClones(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <RbRefreshButton refreshList={fetch} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={streamClones}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
