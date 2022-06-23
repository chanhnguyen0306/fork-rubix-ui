import { storage } from "../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { LogFactory } from "./factory";
import { LogsTable } from "./views/table";

import VieLogs = storage.RubixConnection;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const Logs = () => {
  const [logs, setLogs] = useState([] as VieLogs[]);
  const [isFetching, setIsFetching] = useState(true);
  let factory = new LogFactory();

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
