import { model } from "../../../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowPointFactory } from "./factory";

import Points = model.Point;
import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { FlowPointsTable } from "./views/table";

export const FlowPoints = () => {
  const [data, setDevices] = useState([] as Points[]);
  const [isFetching, setIsFetching] = useState(true);
  let flowPointFactory = new FlowPointFactory();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";
  const deviceUUID = location.state.deviceUUID ?? "";

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
      <Button
        type="primary"
        onClick={fetch}
        style={{ margin: "5px", float: "right" }}
      >
        <RedoOutlined /> Refresh
      </Button>
      <FlowPointsTable
        data={data}
        isFetching={isFetching}
        connUUID={connUUID}
        hostUUID={hostUUID}
        deviceUUID={deviceUUID}
        setIsFetching={setIsFetching}
        refreshList={fetch}
      />
    </>
  );
};
