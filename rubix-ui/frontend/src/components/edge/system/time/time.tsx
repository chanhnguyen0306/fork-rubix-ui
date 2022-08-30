import { Spin } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HostTimeFactory } from "./factory";

export const HostTime = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [data, setData] = useState([] as Array<any>);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new HostTimeFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetHostTime();
      setData(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Spin spinning={isFetching}> {data}</Spin>
    </>
  );
};
