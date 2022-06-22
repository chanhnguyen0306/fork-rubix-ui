import { storage } from "../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import { LogFactory } from "./factory";
import { LogsTable } from "./views/table";

import VieLogs = storage.RubixConnection;

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
      <h1>User Logs</h1>
      <LogsTable
        logs={logs}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
      />
    </>
  );
};
