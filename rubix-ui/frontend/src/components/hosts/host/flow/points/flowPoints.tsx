import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { model } from "../../../../../../wailsjs/go/models";
import { FlowPointFactory } from "./factory";
import { FlowPointsTable } from "./views/table";
import { RbRefreshButton } from "../../../../../common/rb-table-actions";

import Points = model.Point;

export const FlowPoints = () => {
  const [data, setDevices] = useState([] as Points[]);
  const [isFetching, setIsFetching] = useState(true);
  let flowPointFactory = new FlowPointFactory();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";
  const deviceUUID = location.state.deviceUUID ?? "";
  const pluginName = location.state.pluginName ?? "";

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      flowPointFactory.connectionUUID = connUUID;
      flowPointFactory.hostUUID = hostUUID;
      let res = await flowPointFactory.GetPointsForDevice(deviceUUID);
      setDevices(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };
  return (
    <>
      <h3>Points</h3>
      <RbRefreshButton refreshList={fetch} />
      <FlowPointsTable
        data={data}
        isFetching={isFetching}
        connUUID={connUUID}
        hostUUID={hostUUID}
        deviceUUID={deviceUUID}
        setIsFetching={setIsFetching}
        refreshList={fetch}
        pluginName={pluginName}
      />
    </>
  );
};
