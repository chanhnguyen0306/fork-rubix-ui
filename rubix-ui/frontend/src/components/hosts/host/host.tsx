import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Button, Tabs} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {assistmodel, model} from "../../../../wailsjs/go/models";
import {HostsFactory} from "../factory";
import {HostTable} from "./views/hostTable";
import {FlowNetworkFactory} from "../../flow/networks/factory";
import {NetworksTable} from "./views/networksTable";


export const Host = () => {
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";
  const [host, setHost] = useState({} as assistmodel.Host);
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [isFetching, setIsFetching] = useState(true);
  let hostFactory = new HostsFactory();
  let networkFactory = new FlowNetworkFactory();
  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    console.log(key);
  };
  useEffect(() => {
    fetchHost();
    fetchNetworks();
  }, []);

  const fetchHost = async () => {
    try {
      hostFactory.connectionUUID = connUUID
      hostFactory.uuid = hostUUID
      let res = await hostFactory.GetOne();
      console.log("fetch", res, connUUID, hostUUID)
      setHost(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchNetworks = async () => {
    try {
      networkFactory.connectionUUID = connUUID
      networkFactory.uuid = hostUUID
      let res = await networkFactory.GetAll();
      console.log("fetch", res, connUUID, hostUUID)
      setNetworks(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
      <>
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="INFO" key="1">
            <HostTable
                data={host}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
            />
          </TabPane>
          <TabPane tab="NETWORKS" key="2">
            <Button
                type="primary"
                onClick={fetchHost}
                style={{margin: "5px", float: "right"}}
            >
              <RedoOutlined/> Refresh
            </Button>
            <NetworksTable
                data={networks}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
            />
          </TabPane>
          <TabPane tab="BACNET" key="3">
            <Button
                type="primary"
                onClick={fetchHost}
                style={{margin: "5px", float: "right"}}
            >
              <RedoOutlined/> Refresh
            </Button>
            <NetworksTable
                data={networks}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
            />
          </TabPane>
        </Tabs>

      </>

  );
};
