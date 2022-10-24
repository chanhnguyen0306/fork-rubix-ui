import { FlowFactory } from "../rubix-flow/factory";
import { useState, useEffect } from "react";
import { db } from "../../../wailsjs/go/models";
import { RbRefreshButton } from "../../common/rb-table-actions";
import { WiresConnectionsTable } from "./views/table";
import Connection = db.Connection;

export const WiresConnections = () => {
  const [data, setData] = useState([] as Connection[]);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      let res = await factory.GetWiresConnections();
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
