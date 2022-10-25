import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../wailsjs/go/models";
import { RbRefreshButton } from "../../common/rb-table-actions";
import { FlowFactory } from "../rubix-flow/factory";
import { WiresConnectionsTable } from "./views/table";

import Connection = db.Connection;

export const WiresConnections = () => {
  let { connUUID = "", hostUUID = "" } = useParams();
  const [data, setData] = useState([] as Connection[]);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new FlowFactory();

  useEffect(() => {
    fetch(connUUID, hostUUID);
  }, [connUUID, hostUUID]);

  const fetch = async (connUUID: string, hostUUID: string) => {
    try {
      setIsFetching(true);
      const res = await factory.GetWiresConnections(connUUID, hostUUID);
      setData(res);
    } catch (error) {
      setData([]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <RbRefreshButton refreshList={fetch} />
      <WiresConnectionsTable
        data={data}
        isFetching={isFetching}
        refreshList={fetch}
      />
    </>
  );
};

export default WiresConnections;
