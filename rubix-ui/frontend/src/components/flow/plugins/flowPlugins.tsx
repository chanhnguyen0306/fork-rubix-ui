import {model} from "../../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { FlowPluginFactory } from "./factory";
import {FlowPluginsTable} from "./views/table";

import Plugins = model.PluginConf;
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const FlowPlugins = () => {
  const [data, setLogs] = useState([] as Plugins[]);
  const [isFetching, setIsFetching] = useState(true);
  let factory = new FlowPluginFactory();

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
        <FlowPluginsTable
            data={data}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
