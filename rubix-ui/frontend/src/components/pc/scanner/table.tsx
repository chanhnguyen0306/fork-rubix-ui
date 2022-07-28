import { useEffect, useState } from "react";
import { Spin } from "antd";
import { CreateModal } from "./create";
import { openNotificationWithIcon } from "../../../utils/utils";
import { Scanner } from "../../../../wailsjs/go/main/App";
import RbTable from "../../../common/rb-table";
import { RbAddButton, RbRefreshButton } from "../../../common/rb-table-actions";

const ScannerTable = (props: any) => {
  let { data, isFetching, setSelectedIpPorts } = props;

  if (!data) return <></>;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedIpPorts(selectedRows);
    },
  };

  const columns = [
    {
      title: "Ip",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Port",
      dataIndex: "ports",
      render: (services: any[]) =>
        services.map((service, index) => (
          <p key={index}> {`${service.service}: ${service.port}`} </p>
        )),
      key: "ports",
    },
  ];

  return (
    <RbTable
      rowKey="ip"
      rowSelection={rowSelection}
      dataSource={data}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};

export const PcScanner = () => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIpPorts, setSelectedIpPorts] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setIsFetching(true);
    const res = await Scanner("", "", 0, ["1662"]);
    if (res != undefined) {
      setData(res["hosts"]);
      setIsFetching(false);
    } else {
      setIsFetching(false);
    }
  };

  const refreshList = () => {
    fetch();
  };

  const showModal = () => {
    if (selectedIpPorts.length === 0) {
      return openNotificationWithIcon("warning", `Please select Ip`);
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <RbRefreshButton refreshList={refreshList} />
      <RbAddButton showModal={showModal} />
      <ScannerTable
        data={data}
        isFetching={isFetching}
        setSelectedIpPorts={setSelectedIpPorts}
      />
      <CreateModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedIpPorts={selectedIpPorts}
      />
    </>
  );
};
