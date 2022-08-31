import { Space } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScannerTable } from "../../../pc/networking/scanner-table";
import { HostNetworkingFactory } from "./factory";

export const HostNetworking = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [data, setData] = useState([] as Array<any>);
  const [isFetching, setIsFetching] = useState(false);
  const [rcSchema, setRCSchema] = useState(false);

  const factory = new HostNetworkingFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const extraColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              showModal(item);
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ] as never[];

  useEffect(() => {
    fetch();
    fetchRCSchema();
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

  const fetchRCSchema = async () => {
    try {
      const res = await factory.GetRcNetworkSchema();
      setRCSchema(res);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = (net: any) => {
    console.log("rcSchema", rcSchema);
    console.log("net", net);
  };

  return (
    <ScannerTable
      data={data}
      isFetching={isFetching}
      rowKey="id"
      extraColumns={extraColumns}
    />
  );
};
