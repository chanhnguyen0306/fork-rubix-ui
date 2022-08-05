import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import RbTable from "../../../common/rb-table";
import { RbDownloadButton } from "../../../common/rb-table-actions";
import DownloadForm from "./downloadForm";


function tableSchemaBuilder() {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Service",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Port Number",
      dataIndex: "port",
      key: "port",
    },
    {
      title: "Transport",
      dataIndex: "transport",
      key: "transport",
    },
  ];
}

function AppTable(props: any) {
  const { token, selectedRelease } = props;
  const [appDetails, updateAppDetails] = useState({} as any);
  // const [apps, updateApps] = useState(appDetails.apps);
  const [isFetching, updateIsFetching] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const tableSchema = tableSchemaBuilder();
  const [isDownloadModalOpen, updateIsDownloadModalOpen] = useState(false);

  const handleDownload = () => {
    updateIsDownloadModalOpen(true);
  };

  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const isSelected = selectedRowKeys.length > 0;

  const fetchAppDetails = () => {
    if (!(selectedRelease && selectedRelease.url)) {
      return;
      // throw new Error("Selected release do not have url to JSON config");
    }
    updateIsFetching(true);
    return fetch(selectedRelease.url)
      .then((res) => res.json())
      .then((data) => {
        updateAppDetails(data);
      })
      .finally(() => {
        updateIsFetching(false);
      });
  };

  useEffect(() => {
    fetchAppDetails();
  }, [selectedRelease]);

  if (!appDetails) {
    return <div>App JSON config not valid</div>;
  }
  return (
    <div>
      <RbDownloadButton disabled={!isSelected} handleClick={handleDownload} />

      <DownloadForm
        isDownloadModalOpen={isDownloadModalOpen}
        updateIsDownloadModalOpen={updateIsDownloadModalOpen}
        releaseVersion={appDetails.release}
        selectedAppsKeys={selectedRowKeys}
        token={token}
        apps={appDetails.app}
      />
      <RbTable
        rowKey="name"
        dataSource={appDetails.apps}
        columns={tableSchema}
        rowSelection={rowSelection}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
}

export default AppTable;
