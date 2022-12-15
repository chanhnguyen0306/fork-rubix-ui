import { Typography, Card } from "antd";
import { useState, useEffect } from "react";
import { storage } from "../../../wailsjs/go/models";
import { RbRefreshButton } from "../../common/rb-table-actions";
import { LogFactory } from "./factory";
import { LogsTable } from "./views/table";
import VieLogs = storage.RubixConnection;

const { Title } = Typography;

export const Logs = () => {
  const [logs, setLogs] = useState([] as VieLogs[]);
  const [isFetching, setIsFetching] = useState(true);

  const logFactory = new LogFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      let res = (await logFactory.GetAll()) || [];
      setLogs(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Logs
      </Title>
      <Card bordered={false}>
        <RbRefreshButton refreshList={fetch} />
        <LogsTable
          logs={logs}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          fetch={fetch}
        />
      </Card>
    </>
  );
};
