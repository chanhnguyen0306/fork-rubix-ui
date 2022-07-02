import {model} from "../../../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowDeviceFactory } from "./factory";
import {FlowDeviceTable} from "./views/table";

import Devices = model.Device;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const FlowDevices= () => {
  const [data, setLogs] = useState([] as Devices[]);
  const [isFetching, setIsFetching] = useState(true);
  let factory = new FlowDeviceFactory();

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
        <FlowDeviceTable
            data={data}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
