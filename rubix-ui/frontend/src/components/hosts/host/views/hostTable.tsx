import { Descriptions, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assistmodel } from "../../../../../wailsjs/go/models";
import { HostsFactory } from "../../factory";

import Host = assistmodel.Host;
export const HostTable = (props: any) => {
  let { connUUID = "", hostUUID = "" } = useParams();
  const [host, setHost] = useState({} as Host);
  const [isFetching, setIsFetching] = useState(false);

  let hostFactory = new HostsFactory();
  hostFactory.connectionUUID = connUUID;
  hostFactory.uuid = hostUUID;

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      let res = await hostFactory.GetOne();
      setHost(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Spin spinning={isFetching}>
      <Descriptions title="Host Info">
        <Descriptions.Item label="uuid">{host.uuid}</Descriptions.Item>
        <Descriptions.Item label="name">{host.name}</Descriptions.Item>
      </Descriptions>
    </Spin>
  );
};
