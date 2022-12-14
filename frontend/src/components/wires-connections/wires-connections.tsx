import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../wailsjs/go/models";
import { RbRefreshButton } from "../../common/rb-table-actions";
import { FlowFactory } from "../rubix-flow/factory";
import { WiresConnectionsTable } from "./views/table";

import Connection = db.Connection;

export const WiresConnections = () => {
  const [data, setData] = useState([] as Connection[]);
  const [isFetching, setIsFetching] = useState(false);
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  useEffect(() => {
    fetch();
  }, [connUUID, hostUUID]);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res =
        (await factory.GetWiresConnections(connUUID, hostUUID, isRemote)) || [];
      setData(res);
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
