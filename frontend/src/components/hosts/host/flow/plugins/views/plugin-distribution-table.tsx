import { Modal, Spin, Switch } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RbTable from "../../../../../../common/rb-table";
import { FlowPluginFactory } from "../factory";
import { PluginDownloadModal } from "./plugin-download-modal";
import { RbRefreshButton } from "../../../../../../common/rb-table-actions";

const { confirm } = Modal;

export const PluginDistributionTable = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const factory = new FlowPluginFactory();

  const columns = [
    {
      title: "name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "installed",
      key: "is_installed",
      dataIndex: "is_installed",
      render(is_installed: boolean, item: any) {
        return (
          <Switch checked={is_installed} onChange={() => onChange(item)} />
        );
      },
    },
  ];

  const showPromiseConfirm = (pluginName: string) => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleFilled />,
      content: "Do you want to uninstall these apps ?",
      className: "text-start",
      onOk() {
        return unInstallPlugin(pluginName);
      },
      onCancel() {},
    });
  };

  const onChange = async (item: any) => {
    const updatePlugin = { ...item, is_installed: !item.is_installed };
    if (updatePlugin.is_installed) {
      await factory.InstallPlugin(connUUID, hostUUID, item.name);
    } else {
      showPromiseConfirm(item.name);
    }
  };

  const unInstallPlugin = async (pluginName: string) => {
    await factory.UnInstallPlugin(connUUID, hostUUID, pluginName);
    fetchPlugins();
  };

  const fetchPlugins = async () => {
    try {
      setIsFetching(true);
      const { data = [] } = await factory.GetPluginsDistribution(
        connUUID,
        hostUUID
      );
      setPlugins(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  return (
    <>
      <RbRefreshButton refreshList={fetchPlugins} />
      <RbTable
        rowKey="name"
        dataSource={plugins}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />

      <PluginDownloadModal />
    </>
  );
};
