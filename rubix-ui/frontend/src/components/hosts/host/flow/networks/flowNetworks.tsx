import {model} from "../../../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowNetworkFactory } from "./factory";
import {FlowNetworkTable} from "./views/table";

import VieLogs = model.Network;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";

export const FlowNetwork = () => {
  const [data, setLogs] = useState([] as VieLogs[]);
  const [isFetching, setIsFetching] = useState(true);
    const location = useLocation() as any;
    const connUUID = location.state.connUUID ?? "";
    const hostUUID = location.state.hostUUID ?? "";
    const networkUUID = location.state.networkUUID ?? "";
  let factory = new FlowNetworkFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      let res = await factory.GetAll();
      setLogs(res);
    } catch (error) {
      console.log(error);
      setLogs([]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
      <>
        <Button
            type="primary"
            onClick={fetch}
            style={{margin: "5px", float: "right"}}
        >
          <RedoOutlined/> Refresh
        </Button>
        <FlowNetworkTable
            data={data}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
