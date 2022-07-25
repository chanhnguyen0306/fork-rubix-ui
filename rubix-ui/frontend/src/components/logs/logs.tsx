import { storage } from "../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import { LogFactory } from "./factory";
import { LogsTable } from "./views/table";
import { RbRefreshButton } from "../../common/rb-table-actions";

import VieLogs = storage.RubixConnection;

export const Logs = () => {
  const [logs, setLogs] = useState([] as VieLogs[]);
  const [isFetching, setIsFetching] = useState(true);

  let logFactory = new LogFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    console.log(4534);

    try {
      let res = await logFactory.GetAll();
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
      <RbRefreshButton refreshList={fetch} />
      <LogsTable
        logs={logs}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
        fetch={fetch}
      />
    </>
  );
};
