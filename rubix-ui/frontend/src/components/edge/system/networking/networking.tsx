import { Spin } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RbTable from "../../../../common/rb-table";
import { NETWORKING_HEADERS } from "../../../../constants/headers";
import { HostNetworkingFactory } from "./factory";

export const Networking = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [data, setData] = useState([] as Array<any>);
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<any>);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new HostNetworkingFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

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
      let res = await factory.GetNetworks();
      res = res.map((network: any, index: number) => {
        return { ...network, id: index };
      });
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <RbTable
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={data}
        columns={NETWORKING_HEADERS}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
