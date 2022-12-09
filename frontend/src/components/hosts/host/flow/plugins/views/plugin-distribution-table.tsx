import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RbTable from "../../../../../../common/rb-table";
import { RbButton } from "../../../../../../common/rb-table-actions";
import { PLUGIN_HEADERS } from "../../../../../../constants/headers";
import { FlowPluginFactory } from "../factory";

export const PluginDistributionTable = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [pluginsNames, setPluginsNames] = useState<Array<string>>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new FlowPluginFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const columns = PLUGIN_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: Array<any>) => {
      console.log("selectedRows", selectedRows);
      setPluginsNames(selectedRows.map((x) => x.name));
    },
  };

  const fetchPlugins = async () => {
    try {
      setIsFetching(true);
      const { data = [] } = await factory.GetPluginsDistribution(
        connUUID,
        hostUUID
      );
      console.log(data);
      setPlugins(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const InstallButton = () => {
    const install = async () => {
      console.log("InstallButton");
    };

    return (
      <RbButton
        text="install"
        onClick={install}
        style={{ backgroundColor: "#fa8c16", color: "white" }}
      />
    );
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  return (
    <>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={plugins}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
