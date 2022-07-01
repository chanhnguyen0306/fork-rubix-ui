import {model, storage} from "../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowNetworkFactory } from "./factory";
import { LogsTable } from "./views/table";

import VieLogs = model.Network;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const Flow = () => {
  const [logs, setLogs] = useState([] as VieLogs[]);
  const [isFetching, setIsFetching] = useState(true);
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
        <LogsTable
            logs={logs}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
