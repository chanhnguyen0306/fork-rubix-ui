import { Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { FlowFrameworkNetworkCloneFactory } from "../factory";
import { ROUTES } from "../../../../../../../constants/routes";
import { FLOW_NETWORKS_HEADERS } from "../../../../../../../constants/headers";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../../../../../common/rb-table-actions";
import RbTable from "../../../../../../../common/rb-table";

import UUIDs = main.UUIDs;
import FlowNetworkClone = model.FlowNetworkClone;

export const NetworkClonesTable = (props: any) => {
  let {
    connUUID = "",
    hostUUID = "",
    netUUID = "",
    locUUID = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [networks, setNetworks] = useState([] as Array<UUIDs>);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowFrameworkNetworkCloneFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = [
    ...FLOW_NETWORKS_HEADERS,
    {
      title: "actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: FlowNetworkClone) => (
        <Space size="middle">
          <Link to={getNavigationLink(network.uuid)}>View Streams</Link>
        </Space>
      ),
    },
  ];

  const getNavigationLink = (flNetworkCloneUUID: string): string => {
    return ROUTES.STREAMCLONES.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID)
      .replace(":flNetworkCloneUUID", flNetworkCloneUUID);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll(false);
      setNetworks(res);
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
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={networks}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
