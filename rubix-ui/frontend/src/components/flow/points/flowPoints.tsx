import {model} from "../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowPointFactory } from "./factory";
import {FlowPointsTable} from "./views/table";

import Points = model.Point;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const FlowNetwork = () => {
  const [data, setLogs] = useState([] as Points[]);
  const [isFetching, setIsFetching] = useState(true);
  let factory = new FlowPointFactory();

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
        <FlowPointsTable
            data={data}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
